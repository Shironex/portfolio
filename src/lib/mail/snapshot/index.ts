import * as Sentry from '@sentry/nextjs'
import type { Browser, LaunchOptions } from 'puppeteer'

// Get browser launch options optimized for production
function getBrowserOptions(): any {
  const isProduction = process.env.NODE_ENV === 'production'
  
  const baseOptions: any = {
    headless: true,
    timeout: 30000, // 30 second timeout
    // Critical: Do NOT use pipe: true in Docker (causes Target closed errors per GitHub #6258)
    pipe: false,
    args: [
      // Essential Docker/container stability flags
      '--no-sandbox',
      '--disable-setuid-sandbox', 
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-ipc-flooding-protection',
      
      // Additional container stability flags  
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-plugins',
      '--disable-sync',
      '--disable-translate',
      '--disable-background-networking',
      '--disable-background-mode',
      '--disable-client-side-phishing-detection',
      '--disable-hang-monitor',
      '--disable-popup-blocking',
      '--disable-prompt-on-repost',
      '--disable-component-update',
      '--disable-domain-reliability',
      '--disable-web-security',
      '--disable-features=TranslateUI,VizDisplayCompositor',
      
      // Process management for containers
      '--no-zygote',
      '--single-process',
      '--run-all-compositor-stages-before-draw',
      '--disable-checker-imaging',
      
      // Memory optimizations
      '--memory-pressure-off',
      '--max_old_space_size=4096',
      '--aggressive-cache-discard',
    ],
  }
  
  if (isProduction) {
    // Production-specific: Use system Chromium in Docker
    baseOptions.executablePath = '/usr/bin/chromium-browser'
    
    // Additional Docker-specific flags for Alpine Linux
    baseOptions.args.push(
      '--disable-logging',
      '--disable-crash-reporter',
      '--disable-metrics',
      '--disable-metrics-reporting'
    )
  }
  
  return baseOptions
}

// Create a fresh browser instance with connection stability
async function createBrowser(): Promise<Browser> {
  const options = getBrowserOptions()
  const isProduction = process.env.NODE_ENV === 'production'

  let puppeteer
  if (isProduction) {
    // In production, use puppeteer-core with system Chromium
    puppeteer = await import('puppeteer-core')
  } else {
    // For local development, try full puppeteer first
    try {
      puppeteer = await import('puppeteer')
    } catch (error) {
      // Fallback to puppeteer-core if puppeteer is not available
      puppeteer = await import('puppeteer-core')
      
      // For local development, try common browser paths
      const possiblePaths = [
        // macOS paths
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
        '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
        '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
        '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
        // Linux paths
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium',
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
      ]

      const { execSync } = await import('child_process')
      for (const path of possiblePaths) {
        try {
          execSync(`test -f "${path}"`, { stdio: 'ignore' })
          options.executablePath = path
          break
        } catch {
          continue
        }
      }

      if (!options.executablePath) {
        throw new Error(
          'No Chrome/Chromium installation found. Please install Chrome, Chromium, Brave, or Edge browser.'
        )
      }
    }
  }

  // Launch browser with retry logic for connection stability
  let lastError: Error | null = null
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const browser = await puppeteer.launch(options) as Browser
      
      // Verify browser is responsive before returning
      await Promise.race([
        browser.version(), // Test DevTools connection
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Browser connection timeout')), 10000)
        )
      ])
      
      return browser
    } catch (error) {
      lastError = error as Error
      console.warn(`Browser launch attempt ${attempt} failed:`, error instanceof Error ? error.message : 'Unknown error')
      
      if (attempt < 3) {
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
      }
    }
  }
  
  throw lastError || new Error('Failed to launch browser after 3 attempts')
}

// Create a page with robust error handling
async function createPageWithRetry(browser: Browser): Promise<any> {
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const page = await browser.newPage()
      
      // Set up page with proper error handling and timeouts
      page.setDefaultTimeout(30000) // 30 seconds
      page.setDefaultNavigationTimeout(30000)
      
      // Set up error handlers before using the page
      page.on('error', (error) => {
        console.warn('Page error:', error.message)
      })
      
      page.on('pageerror', (error) => {
        console.warn('Page script error:', error.message)
      })
      
      // Test page responsiveness with a simple operation
      await Promise.race([
        page.evaluate(() => document.readyState),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Page test timeout')), 5000)
        )
      ])
      
      return page
    } catch (error) {
      lastError = error as Error
      console.warn(`Page creation attempt ${attempt} failed:`, error instanceof Error ? error.message : 'Unknown error')
      
      if (attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, 500 * attempt))
      }
    }
  }
  
  throw lastError || new Error('Failed to create page after 3 attempts')
}

export async function emailHtmlToImage(html: string): Promise<Buffer> {
  return await Sentry.startSpan(
    {
      name: 'Email HTML to Image Conversion',
      op: 'puppeteer.screenshot',
      attributes: {
        'html.length': html.length,
        'environment': process.env.NODE_ENV || 'development',
      },
    },
    async (span) => {
      let browser: Browser | null = null
      let page = null
      const startTime = Date.now()
      
      try {
        span.addEvent('Creating browser instance')
        
        // Create fresh browser instance with connection stability
        browser = await createBrowser()
        
        span.addEvent('Browser created, creating page')
        
        // Create page with retry logic
        page = await createPageWithRetry(browser)
        
        span.addEvent('Page created, setting viewport')
        
        // Set viewport to ensure consistent rendering
        await page.setViewport({
          width: 600,
          height: 800,
          deviceScaleFactor: 2, // Higher quality screenshots
        })

        span.addEvent('Viewport set, loading HTML content')
        
        // Set HTML content with robust waiting and timeout protection
        await Promise.race([
          page.setContent(html, {
            waitUntil: ['load', 'domcontentloaded'],
            timeout: 30000,
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('HTML content loading timeout')), 35000)
          )
        ])
        
        span.addEvent('HTML loaded, waiting for render stability')
        
        // Wait for render stability with multiple fallbacks
        await Promise.race([
          // Try to wait for complete render
          page.waitForFunction(
            () => {
              return document.readyState === 'complete' && 
                     (!window.requestAnimationFrame || 
                      new Promise(resolve => {
                        requestAnimationFrame(() => {
                          requestAnimationFrame(resolve)
                        })
                      }))
            },
            { timeout: 10000 }
          ).catch(() => null), // Don't fail if this times out
          // Always wait at least 2 seconds for fonts and images
          new Promise(resolve => setTimeout(resolve, 2000))
        ])

        span.addEvent('Getting content dimensions')
        
        // Get content dimensions with robust error handling
        const contentHeight = await page.evaluate(() => {
          try {
            const body = document.body
            const html = document.documentElement
            return Math.max(
              body?.scrollHeight || 0,
              body?.offsetHeight || 0,
              html?.clientHeight || 0,
              html?.scrollHeight || 0,
              html?.offsetHeight || 0,
              800 // Minimum height fallback
            )
          } catch {
            return 800 // Fallback height
          }
        })

        const finalHeight = Math.min(Math.max(contentHeight, 800), 2000)
        
        span.addEvent('Updating viewport for full capture', {
          contentHeight,
          finalHeight,
        })
        
        // Update viewport to capture full height
        await page.setViewport({
          width: 600,
          height: finalHeight,
          deviceScaleFactor: 2,
        })

        span.addEvent('Taking screenshot')
        
        // Take screenshot with timeout protection and better options
        const screenshot = await Promise.race([
          page.screenshot({
            type: 'png',
            fullPage: true,
            encoding: 'binary',
            captureBeyondViewport: false, // More stable in containers
            optimizeForSpeed: false, // Prioritize quality
          }),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Screenshot timeout')), 25000)
          )
        ])
        
        const duration = Date.now() - startTime
        
        span.setAttributes({
          'screenshot.success': true,
          'screenshot.height': finalHeight,
          'screenshot.duration_ms': duration,
          'browser.version': await browser.version().catch(() => 'unknown'),
        })
        
        span.addEvent('Screenshot completed successfully', {
          duration,
          size: screenshot.length,
        })

        return screenshot as Buffer
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        const errorName = error instanceof Error ? error.name : 'UnknownError'
        
        span.setAttributes({
          'screenshot.success': false,
          'error.message': errorMessage,
          'error.name': errorName,
        })

        Sentry.captureException(error, {
          tags: {
            source: 'email_snapshot',
            errorType: 'puppeteer_error',
            errorName,
          },
          extra: {
            htmlLength: html.length,
            environment: process.env.NODE_ENV,
          },
        })

        throw error
      } finally {
        // Always clean up resources with proper error handling
        const cleanupTasks = []
        
        if (page) {
          cleanupTasks.push(
            (async () => {
              try {
                if (!page.isClosed()) {
                  await Promise.race([
                    page.close(),
                    new Promise((_, reject) => 
                      setTimeout(() => reject(new Error('Page close timeout')), 5000)
                    )
                  ])
                }
              } catch (error) {
                console.warn('Failed to close page:', error instanceof Error ? error.message : 'Unknown error')
              }
            })()
          )
        }
        
        if (browser) {
          cleanupTasks.push(
            (async () => {
              try {
                await Promise.race([
                  browser.close(),
                  new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Browser close timeout')), 8000)
                  )
                ])
              } catch (error) {
                console.warn('Failed to close browser:', error instanceof Error ? error.message : 'Unknown error')
              }
            })()
          )
        }
        
        // Wait for all cleanup tasks with timeout
        await Promise.race([
          Promise.allSettled(cleanupTasks),
          new Promise(resolve => setTimeout(resolve, 10000)) // Max 10s for cleanup
        ])
      }
    }
  )
}

// Test function to verify browser functionality
export async function testBrowser(): Promise<boolean> {
  try {
    console.log('Testing browser functionality...')
    const browser = await createBrowser()
    const page = await createPageWithRetry(browser)
    
    await page.setContent('<html><body><h1>Test</h1></body></html>', {
      waitUntil: ['load', 'domcontentloaded'],
      timeout: 10000,
    })
    
    const title = await page.evaluate(() => document.querySelector('h1')?.textContent)
    
    await page.close()
    await browser.close()
    
    const success = title === 'Test'
    console.log(success ? '✅ Browser test passed' : '❌ Browser test failed')
    return success
  } catch (error) {
    console.error('❌ Browser test failed:', error instanceof Error ? error.message : 'Unknown error')
    return false
  }
}