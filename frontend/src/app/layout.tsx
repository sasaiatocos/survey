import { Inter } from 'next/font/google';
import './ui/globals.css';
import 'sanitize.css';
import React from 'react';
import { SITE_NAME } from '@/constants';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: SITE_NAME,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang='ja'>
        <body className={`${inter.className} antialiased`}>
          {children}
        </body>
      </html>
    </>
  );
}
