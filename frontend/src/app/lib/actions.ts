'use server'

import { cookies } from 'next/headers'

export async function handleLogin(sessionData: any) {
  const encryptedSessionData = encrypt(sessionData);
  cookies().set('session', encryptedSessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}