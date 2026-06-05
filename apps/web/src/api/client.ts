import axios from 'axios'

export const client = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string | undefined) ?? '/v1',
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('cc.token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const msg = error.response?.data?.message
    if (typeof msg === 'string') return msg
    if (Array.isArray(msg)) return msg.join(', ')
  }
  return 'Algo deu errado. Tente novamente.'
}
