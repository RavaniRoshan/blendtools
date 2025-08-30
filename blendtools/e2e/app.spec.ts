import { test, expect } from '@playwright/test'

test.describe('BlendTools Application', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')
    
    // Wait for the app to load
    await expect(page.getByText('BlendTools')).toBeVisible()
    
    // Check for main navigation
    await expect(page.getByRole('navigation')).toBeVisible()
    
    // Check for dashboard content
    await expect(page.getByText('Scene Overview')).toBeVisible()
    await expect(page.getByText('Material Inspector')).toBeVisible()
    await expect(page.getByText('Render Settings')).toBeVisible()
    await expect(page.getByText('Render Queue')).toBeVisible()
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/')
    
    // Test Script Hub navigation
    await page.getByRole('link', { name: 'Script Hub' }).click()
    await expect(page.getByText('Script Hub')).toBeVisible()
    
    // Test Shader Library navigation
    await page.getByRole('link', { name: 'Shader Library' }).click()
    await expect(page.getByText('Shader Library')).toBeVisible()
    
    // Test Projects navigation
    await page.getByRole('link', { name: 'Projects' }).click()
    await expect(page.getByText('Projects')).toBeVisible()
    
    // Test Render Queue navigation
    await page.getByRole('link', { name: 'Render Queue' }).click()
    await expect(page.getByText('Render Queue')).toBeVisible()
    await expect(page.getByText('Manage and monitor your render jobs')).toBeVisible()
  })

  test('should be responsive', async ({ page }) => {
    await page.goto('/')
    
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 })
    await expect(page.getByRole('navigation')).toBeVisible()
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('navigation')).toBeVisible()
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    // Navigation might be hidden on mobile, but should be accessible via menu
    const menuButton = page.getByRole('button', { name: /menu/i })
    if (await menuButton.isVisible()) {
      await menuButton.click()
      await expect(page.getByRole('navigation')).toBeVisible()
    }
  })

  test('should show development notice', async ({ page }) => {
    await page.goto('/')
    
    // Development notice should be visible
    await expect(page.getByText(/development mode/i)).toBeVisible()
  })

  test('should have accessible elements', async ({ page }) => {
    await page.goto('/')
    
    // Check for proper heading structure
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    
    // Check for proper button labels
    const buttons = page.getByRole('button')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i)
      const accessibleName = await button.getAttribute('aria-label') || await button.textContent()
      expect(accessibleName).toBeTruthy()
    }
    
    // Check for proper link labels
    const links = page.getByRole('link')
    const linkCount = await links.count()
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i)
      const accessibleName = await link.getAttribute('aria-label') || await link.textContent()
      expect(accessibleName).toBeTruthy()
    }
  })
})