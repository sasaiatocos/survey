import { AuthProvider } from './components/AuthContext';
import Header from './components/Header';
import 'sanitize.css';
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <html lang='ja'>
        <body>
          <AuthProvider>
            <Header />
            <main>{children}</main>
          </AuthProvider>
        </body>
      </html>
    </>
  );
}
