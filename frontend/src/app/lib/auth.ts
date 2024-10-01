import { cache } from 'react';
import { getServerSession as originalGetServerSession } from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL

type ClientType = {
    clientId: string;
    clientSecret: string;
};

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
        } as ClientType),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account }) {
            const provider = account?.provider;
            const uuid = user?.id
            const name = user?.name;
            const email = user?.email;

            try {
                const response = await axios.post(`${apiUrl}/api/auth/${provider}/callback`, {
                    provider, uuid, name, email
                })
                if (response.status === 200) {
                    return true
                } else {
                    return false
                }
            } catch (error) {
                console.log('エラー', error)
                return false
            }
        },
    },
};

export const getServerSession = cache(async () => {
    return originalGetServerSession(authOptions);
});