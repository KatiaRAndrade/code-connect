import { client } from './client'

export interface PublicUser {
  id: number
  name: string
  email: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export async function register(payload: RegisterPayload): Promise<PublicUser> {
  const { data } = await client.post<{ data: PublicUser }>('/auth/register', payload)
  return data.data
}

export async function login(payload: LoginPayload): Promise<string> {
  const { data } = await client.post<{ data: { access_token: string } }>('/auth/login', payload)
  return data.data.access_token
}

export async function me(): Promise<PublicUser> {
  const { data } = await client.get<{ data: PublicUser }>('/auth/me')
  return data.data
}
