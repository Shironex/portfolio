import * as Sentry from '@sentry/nextjs'
import type { Browser, LaunchOptions } from 'puppeteer'

let browser: Browser | null = null

async function getBrowser() {
  if (browser) {
    return browser
  }

  const options: any = {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-extensions',
    ],
    headless: true,
  }

  // Check if running in Docker (production)
  const isDocker = process.env.NODE_ENV === 'production'

  let puppeteer
  if (isDocker) {
    // In Docker, use puppeteer-core with system Chromium
    puppeteer = await import('puppeteer-core')
    options.executablePath = '/usr/bin/chromium-browser'
  } else {
    // For local development, use full puppeteer which manages Chrome
    try {
      puppeteer = await import('puppeteer')
      // puppeteer will automatically find/download Chrome
    } catch (error) {
      // Fallback to puppeteer-core if puppeteer is not available
      puppeteer = await import('puppeteer-core')
      
      // For local development with puppeteer-core, try common Chromium paths
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
        // Windows paths (running on WSL or similar)
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      ]

      // Find the first available browser
      const { execSync } = await import('child_process')
      for (const path of possiblePaths) {
        try {
          // Check if the path exists
          if (process.platform === 'win32') {
            // Windows check
            execSync(`if exist "${path}" echo exists`, { stdio: 'ignore' })
          } else {
            // Unix-like systems check
            execSync(`test -f "${path}"`, { stdio: 'ignore' })
          }
          options.executablePath = path
          break
        } catch {
          // Path doesn't exist, try next one
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

  browser = await puppeteer.launch(options) as Browser
  return browser
}

export async function emailHtmlToImage(html: string): Promise<Buffer> {
  return await Sentry.startSpan(
    {
      name: 'Email HTML to Image Conversion',
      op: 'puppeteer.screenshot',
      attributes: {
        'html.length': html.length,
      },
    },
    async (span) => {
      let page = null
      try {
        const browserInstance = await getBrowser()
        if (!browserInstance) {
          throw new Error('Failed to initialize browser')
        }
        page = await browserInstance.newPage()

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
        span.setAttributes({
          'screenshot.success': false,
          'error.message': error instanceof Error ? error.message : 'Unknown error',
        })

        Sentry.captureException(error, {
          tags: {
            source: 'email_snapshot',
            errorType: 'puppeteer_error',
          },
        })

        throw error
      } finally {
        if (page) {
          await page.close()
        }
      }
    }
  )
}

// Cleanup function to close browser when needed
export async function closeBrowser() {
  if (browser) {
    await browser.close()
    browser = null
  }
}

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGINT', closeBrowser)
  process.on('SIGTERM', closeBrowser)
}