import { expect, test } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate to home page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /about/i }).first().click()
    await expect(page).toHaveURL('/about')
  })

  test('should navigate to projects page', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('link', { name: /projects/i })
      .first()
      .click()
    await expect(page).toHaveURL('/projects')
  })

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('link', { name: /contact/i })
      .first()
      .click()
    await expect(page).toHaveURL('/contact')
  })

  test('should navigate back to home from navbar logo', async ({ page }) => {
    await page.goto('/about')
    // Click on logo or home link
    await page.getByRole('link', { name: /home/i }).first().click()
    await expect(page).toHaveURL('/')
  })
})

test.describe('Navigation Bar', () => {
  test('should display navigation bar on all pages', async ({ page }) => {
    const pages = ['/', '/about', '/projects', '/contact']

    for (const pagePath of pages) {
      await page.goto(pagePath)
      // Use .first() since there are both desktop and mobile nav elements
      await expect(page.getByRole('navigation').first()).toBeVisible()
    }
  })

  test('should have all navigation links in navbar', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('link', { name: /about/i }).first()
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /projects/i }).first()
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /contact/i }).first()
    ).toBeVisible()
  })
})

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('should display mobile menu toggle', async ({ page }) => {
    await page.goto('/')
    // Look for mobile menu button (hamburger icon)
    const mobileMenuButton = page
      .getByRole('button', { name: /menu/i })
      .or(page.locator('[aria-label*="menu"]'))
    await expect(mobileMenuButton.first()).toBeVisible()
  })

  test('should open mobile menu when toggle is clicked', async ({ page }) => {
    await page.goto('/')

    // Find and click mobile menu toggle
    const mobileMenuButton = page
      .getByRole('button', { name: /menu/i })
      .or(page.locator('[aria-label*="menu"]'))
    await mobileMenuButton.first().click()

    // Menu should be visible
    // Note: Adjust selector based on your actual mobile menu implementation
    await page.waitForTimeout(500) // Wait for animation

    // Navigation links should be visible in mobile menu (use .first() since there are desktop + mobile nav)
    await expect(
      page.getByRole('link', { name: /about/i }).first()
    ).toBeVisible()
  })

  test('should close mobile menu when link is clicked', async ({ page }) => {
    await page.goto('/')

    // Open mobile menu
    const mobileMenuButton = page
      .getByRole('button', { name: /menu/i })
      .or(page.locator('[aria-label*="menu"]'))
    await mobileMenuButton.first().click()

    // Click on a navigation link
    await page.getByRole('link', { name: /about/i }).first().click()

    // Should navigate to about page
    await expect(page).toHaveURL('/about')
  })
})

test.describe('Footer', () => {
  test('should display footer on all pages', async ({ page }) => {
    const pages = ['/', '/about', '/projects', '/contact']

    for (const pagePath of pages) {
      await page.goto(pagePath)
      await expect(page.getByRole('contentinfo')).toBeVisible()
    }
  })
})

test.describe('Page Titles', () => {
  test('should have correct title on home page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/.+/)
  })

  test('should have correct title on about page', async ({ page }) => {
    await page.goto('/about')
    await expect(page).toHaveTitle(/about/i)
  })

  test('should have correct title on projects page', async ({ page }) => {
    await page.goto('/projects')
    await expect(page).toHaveTitle(/projects/i)
  })

  test('should have correct title on contact page', async ({ page }) => {
    await page.goto('/contact')
    await expect(page).toHaveTitle(/contact/i)
  })
})

test.describe('Browser Navigation', () => {
  test('should support browser back button', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /about/i }).first().click()
    await expect(page).toHaveURL('/about')

    await page.goBack()
    await expect(page).toHaveURL('/')
  })

  test('should support browser forward button', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('link', { name: /projects/i })
      .first()
      .click()
    await expect(page).toHaveURL('/projects')

    await page.goBack()
    await expect(page).toHaveURL('/')

    await page.goForward()
    await expect(page).toHaveURL('/projects')
  })
})
