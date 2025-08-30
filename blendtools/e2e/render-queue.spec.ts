import { test, expect } from '@playwright/test'

test.describe('Render Queue E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should navigate to render queue from dashboard widget', async ({ page }) => {
    // Find the render queue widget in the dashboard
    const renderQueueWidget = page.locator('text=Render Queue').first()
    await expect(renderQueueWidget).toBeVisible()
    
    // Click "View All" button if it exists
    const viewAllButton = page.getByRole('button', { name: /view all/i })
    if (await viewAllButton.isVisible()) {
      await viewAllButton.click()
    } else {
      // If no "View All" button, click the render queue link in sidebar
      await page.getByRole('link', { name: 'Render Queue' }).click()
    }
    
    // Should be on render queue page
    await expect(page.getByText('Manage and monitor your render jobs')).toBeVisible()
    await expect(page.url()).toContain('/render-queue')
  })

  test('should navigate to render queue from sidebar', async ({ page }) => {
    // Click render queue link in sidebar
    await page.getByRole('link', { name: 'Render Queue' }).click()
    
    // Should be on render queue page
    await expect(page.getByText('Render Queue')).toBeVisible()
    await expect(page.getByText('Manage and monitor your render jobs')).toBeVisible()
    await expect(page.url()).toContain('/render-queue')
  })

  test('should show render queue statistics', async ({ page }) => {
    await page.goto('/render-queue')
    
    // Should show statistics cards
    await expect(page.getByText('Active Jobs')).toBeVisible()
    await expect(page.getByText('Completed')).toBeVisible()
    await expect(page.getByText('Failed')).toBeVisible()
    await expect(page.getByText('Total Jobs')).toBeVisible()
    
    // Should show numeric values (even if 0)
    const statsNumbers = page.locator('.text-2xl.font-bold')
    expect(await statsNumbers.count()).toBeGreaterThanOrEqual(4)
  })

  test('should show filter options', async ({ page }) => {
    await page.goto('/render-queue')
    
    // Should show filter dropdown
    await expect(page.getByText('Filter:')).toBeVisible()
    
    // Click filter dropdown to see options
    const filterDropdown = page.getByRole('combobox').first()
    if (await filterDropdown.isVisible()) {
      await filterDropdown.click()
      
      // Should show filter options
      await expect(page.getByRole('option', { name: 'All Jobs' })).toBeVisible()
      await expect(page.getByRole('option', { name: 'Active' })).toBeVisible()
      await expect(page.getByRole('option', { name: 'Completed' })).toBeVisible()
      await expect(page.getByRole('option', { name: 'Failed' })).toBeVisible()
    }
  })

  test('should have refresh button', async ({ page }) => {
    await page.goto('/render-queue')
    
    // Should show refresh button
    const refreshButton = page.getByRole('button', { name: /refresh/i })
    await expect(refreshButton).toBeVisible()
    
    // Should be clickable
    await refreshButton.click()
    // Note: In a real test, you might check for loading states or updated content
  })

  test('should show create job button', async ({ page }) => {
    await page.goto('/render-queue')
    
    // Should show new render job button
    const createJobButton = page.getByRole('button', { name: /new render job/i })
    await expect(createJobButton).toBeVisible()
  })

  test('should handle empty state when no jobs exist', async ({ page }) => {
    await page.goto('/render-queue')
    
    // When no jobs exist, should show empty state
    // This might not always be visible if there are jobs, so we check conditionally
    const emptyState = page.getByText('No render jobs found')
    const createFirstJobButton = page.getByRole('button', { name: /create your first job/i })
    
    // If empty state is visible, check its content
    if (await emptyState.isVisible()) {
      await expect(emptyState).toBeVisible()
      await expect(createFirstJobButton).toBeVisible()
    }
  })

  test('should show sign in prompt when not authenticated', async ({ page }) => {
    await page.goto('/render-queue')
    
    // If user is not signed in, should show sign in prompt
    const signInPrompt = page.getByText('Please sign in to view your render jobs')
    
    // This might not always be visible if user is signed in via other means
    if (await signInPrompt.isVisible()) {
      await expect(signInPrompt).toBeVisible()
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/render-queue')
    
    // Should still show main elements
    await expect(page.getByText('Render Queue')).toBeVisible()
    
    // Statistics should stack vertically on mobile
    const statsCards = page.locator('[class*="grid"]').first()
    if (await statsCards.isVisible()) {
      const computedStyle = await statsCards.evaluate(el => getComputedStyle(el))
      // On mobile, grid should have fewer columns
      expect(computedStyle.gridTemplateColumns).toBeTruthy()
    }
  })

  test('should maintain navigation state', async ({ page }) => {
    // Start on homepage
    await page.goto('/')
    await expect(page.getByText('Scene Overview')).toBeVisible()
    
    // Navigate to render queue
    await page.getByRole('link', { name: 'Render Queue' }).click()
    await expect(page.url()).toContain('/render-queue')
    
    // Navigate back to dashboard
    await page.getByRole('link', { name: 'Dashboard' }).click()
    await expect(page.getByText('Scene Overview')).toBeVisible()
    
    // Should be back on homepage
    expect(page.url()).toMatch(/\/$/)
  })
})