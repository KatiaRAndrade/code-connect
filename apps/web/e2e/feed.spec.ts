import { test, expect } from '@playwright/test'

test.describe('Feed', () => {
  test('exibe a lista de posts', async ({ page }) => {
    await page.goto('/feed')

    await expect(page.getByRole('search')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Recentes' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Populares' })).toBeVisible()
  })

  test('busca posts por palavra-chave', async ({ page }) => {
    await page.goto('/feed')

    await page.getByLabel('Buscar posts').fill('React')
    await page.getByLabel('Buscar posts').press('Enter')

    await expect(page.getByText('React', { exact: false }).first()).toBeVisible()
  })
})
