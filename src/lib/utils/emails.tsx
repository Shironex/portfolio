import { render } from '@react-email/render'
import puppeteer from 'puppeteer-core'

import { ContactFormSchema } from '@/app/contact/_components/validation'

import ContactFormEmail from '../mail/templates/contact-form'

export async function emailFormToPng(
  data: Omit<ContactFormSchema, 'turnstileToken' | 'verify'>,
  width = 600
): Promise<Buffer<ArrayBufferLike>> {
  const html = await render(<ContactFormEmail data={data} />)

  const browser = await puppeteer.launch({
    executablePath:
      process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
    args: process.env.PUPPETEER_ARGS?.split(' ') || [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
    headless: true,
  })

  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'networkidle0' })

  // auto-expand viewport so nothing is cut off
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight
  )

  await page.setViewport({ width, height })

  const png = await page.screenshot({ type: 'png' })

  await browser.close()

  return Buffer.from(png)
}
