import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import './ui/globals.css';
import 'sanitize.css';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppRouterCacheProvider>
        <html lang='ja'>
          <body className={`${inter.className} antialiased`}>
            {children}
          </body>
        </html>
      </AppRouterCacheProvider>
    </>
  );
}
