import { test, expect } from '@playwright/test'

test.describe('Criação de post', () => {
  test('redireciona para o login ao tentar publicar sem estar autenticado', async ({ page }) => {
    await page.goto('/nova-publicacao')

    await expect(page).toHaveURL(/\/login$/)
  })

  test('cria uma nova publicação e exibe seu conteúdo', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email ou usuário').fill('julio@codeconnect.dev')
    await page.getByLabel('Senha').fill('senha123')
    await page.getByRole('button', { name: /login/i }).click()
    await expect(page).toHaveURL(/\/feed$/)

    await page.getByRole('link', { name: 'Publicar' }).click()
    await expect(page).toHaveURL(/\/nova-publicacao$/)

    const title = `Post de teste e2e ${Date.now()}`
    await page.getByLabel('Título').fill(title)
    await page.getByLabel('Descrição').fill('Descrição criada automaticamente por um teste e2e do Playwright.')
    await page.getByLabel('Tags').fill('Playwright')
    await page.getByLabel('Tags').press('Enter')
    await expect(page.getByRole('button', { name: 'Remover filtro Playwright' })).toBeVisible()

    await page.getByRole('button', { name: /publicar/i }).click()

    await expect(page).toHaveURL(/\/posts\/\d+$/)
    await expect(page.getByRole('heading', { name: title })).toBeVisible()
    await expect(page.getByText('Descrição criada automaticamente por um teste e2e do Playwright.')).toBeVisible()
  })
})
