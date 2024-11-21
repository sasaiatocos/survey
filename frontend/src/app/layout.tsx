'use client'

import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './libs/graphqlClient';
import { AuthProvider } from './_components/AuthContext';
import { Inter } from 'next/font/google';
import './ui/globals.css';
import 'sanitize.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <html lang='ja'>
          <body className={`${inter.className} antialiased`}>
            {children}
          </body>
        </html>
      </AuthProvider>
    </ApolloProvider>
  );
}