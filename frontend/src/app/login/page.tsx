'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import styles from './style.module.css';

type formInputs = {
  email: string
  password: string
}

export default function SignIn() {
  const { handleSubmit, register, formState: { errors } } = useForm<formInputs>();
  const onSubmit = handleSubmit(async (data) => {
    await signInWithEmail({ email: data.email, password: data.password }).then(
      (res: boolean) => {
        if (res) {
          console.log('ログイン成功')
        } else {
          console.log('ログイン失敗')
        }
      }
    )
  });

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <FormLabel htmlFor="email">Email</FormLabel>
      <TextField
        {...register('email', {
          required: '必須項目です',
          maxLength: {
            value: 50,
            message: '50文字以内で入力してください',
          },
        })}
        id="email"
        type="email"
        name="email"
        placeholder="your@email.com"
        autoComplete="email"
        autoFocus
        required
        fullWidth
        variant="outlined"
        sx={{ ariaLabel: 'email' }}
      />
      {errors.email && errors.email.message}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <FormLabel htmlFor="password">Password</FormLabel>
      </Box>
      <TextField
        placeholder="••••••"
        type="password"
        id="password"
        autoComplete="current-password"
        autoFocus
        required
        fullWidth
        variant="outlined"
        {...register('password', {
          required: '必須項目です',
          minLength: {
            value: 8,
            message: '8文字以上で入力してください',
          },
          maxLength: {
            value: 50,
            message: '50文字以内で入力してください',
          },
        }
        )
        }
        name="password"
      />
      {errors.password && errors.password.message}
      <Button
        type="submit"
        fullWidth
        variant="contained"
      >
        Sign in
      </Button>
    </form>
  )
}