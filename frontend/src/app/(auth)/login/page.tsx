'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/app/services/authAction/login';
import { useFormStatus } from 'react-dom';
import { TextField } from '@/app/ui/TextField';
import { Section } from '@/app/ui/Section';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';
import styles from './style.module.css';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      if (!response) throw new Error('Login failed')

      const { token } = await response.json()
      document.cookie = `token=${token}; path=/`
      router.push('/protected')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Section>
        <HeadGroup>
          <Heading level={1} size='medium'>
            ログイン
          </Heading>
        </HeadGroup>
        <div className={styles.cardContainer}>
          <form onSubmit={handleLogin} >
            <TextField type="email" name="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <TextField type="password" name="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <LoginButton />
          </form>
        </div>
      </Section>
    </>
  )
}

function LoginButton() {
  const { pending } = useFormStatus()

  const handleClick = (event: { preventDefault: () => void }) => {
    if (pending) {
      event.preventDefault()
    }
  }

  return (
    <button aria-disabled={pending} type="submit" onClick={handleClick}>
      Login
    </button>
  )
}