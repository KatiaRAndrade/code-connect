import { test, expect } from '@playwright/test'

test.describe('Login', () => {
  test('exibe o formulário de login', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
    await expect(page.getByLabel('Email ou usuário')).toBeVisible()
    await expect(page.getByLabel('Senha')).toBeVisible()
  })

  test('exibe erro com credenciais inválidas', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email ou usuário').fill('inexistente@codeconnect.dev')
    await page.getByLabel('Senha').fill('senhaerrada')
    await page.getByRole('button', { name: /login/i }).click()

    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('realiza login com sucesso e redireciona para o feed', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email ou usuário').fill('julio@codeconnect.dev')
    await page.getByLabel('Senha').fill('senha123')
    await page.getByRole('button', { name: /login/i }).click()

    await expect(page).toHaveURL(/\/feed$/)
  })
})
