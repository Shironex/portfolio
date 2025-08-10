import * as Sentry from '@sentry/nextjs'
import type { Browser, LaunchOptions } from 'puppeteer'

// Get browser launch options optimized for production
function getBrowserOptions(): any {
  const isProduction = process.env.NODE_ENV === 'production'
  
  const baseOptions: any = {
    headless: true,
    timeout: 30000, // 30 second timeout
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--disable-extensions',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-web-security',
      '--disable-features=TranslateUI',
      '--disable-default-apps',
    ],
  }
  
  if (isProduction) {
    // Production-specific flags for Docker/Alpine
    baseOptions.args.push(
      '--no-zygote',
      '--single-process',
      '--disable-dev-shm-usage',
      '--memory-pressure-off',
      '--max_old_space_size=4096',
      '--disable-background-networking'
    )
    baseOptions.executablePath = '/usr/bin/chromium-browser'
  }
  
  return baseOptions
}

// Create a fresh browser instance for each operation
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

  return await puppeteer.launch(options) as Browser
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
      
      try {
        // Create fresh browser instance for each operation
        browser = await createBrowser()
        page = await browser.newPage()
        
        // Set page timeout
        page.setDefaultTimeout(15000) // 15 seconds

        // Set viewport to ensure consistent rendering
        await page.setViewport({
          width: 600,
          height: 800,
          deviceScaleFactor: 2, // Higher quality screenshots
        })

        // Set the HTML content
        await page.setContent(html, {
          waitUntil: 'networkidle0',
        })

        // Wait a bit for any animations or async content
        await new Promise(resolve => setTimeout(resolve, 500))

        // Get the actual content dimensions
        const contentHeight = await page.evaluate(() => {
          const body = document.body
          const html = document.documentElement
          return Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
          )
        })

        // Update viewport to capture full height
        await page.setViewport({
          width: 600,
          height: Math.min(contentHeight, 2000), // Cap at 2000px to avoid too large images
          deviceScaleFactor: 2,
        })

        // Take screenshot
        const screenshot = await page.screenshot({
          type: 'png',
          fullPage: true,
          encoding: 'binary',
        })

        span.setAttributes({
          'screenshot.success': true,
          'screenshot.height': contentHeight,
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
        // Always clean up resources
        try {
          if (page && !page.isClosed()) {
            await page.close()
          }
        } catch (cleanupError) {
          console.warn('Failed to close page:', cleanupError)
        }
        
        try {
          if (browser) {
            await browser.close()
          }
        } catch (cleanupError) {
          console.warn('Failed to close browser:', cleanupError)
        }
      }
    }
  )
}

// Test function to verify browser functionality
export async function testBrowser(): Promise<boolean> {
  try {
    const browser = await createBrowser()
    const page = await browser.newPage()
    await page.goto('data:text/html,<html><body>Test</body></html>')
    await page.close()
    await browser.close()
    return true
  } catch (error) {
    console.error('Browser test failed:', error)
    return false
  }
}