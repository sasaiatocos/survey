import { ReactNode } from 'react';

export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    password: string;
    remember_token: string;
    last_login_at: string;
    created_at: string;
    updated_at: string;
}

export type AuthProviderProps = {
	children: ReactNode;
};

export type AuthState = {
    user: User | null | undefined
};

export type UserGuardProps = {
    children: ((user: User) => ReactNode) | ReactNode;
}