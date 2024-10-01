'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { Icon } from '@/app/ui/Icon';
import * as Layout from '@/app/ui/Layout';
import { renderLink } from '@/app/ui/Layout/Navigation';
import type { GetCategoriesResponse } from '@/services/getCategories';
import { roboto } from '@/app/fonts';
import { QuestionCreateModalContainer } from '../QuestionCreateModalContainer';
import styles from './style.module.css';

type Props = {
    categories: GetCategoriesResponse['categories'];
};

export function ClientLayoutNavigation({ categories }: Props) {
    const { data: session } = useSession();
    const currentPathname = usePathname();
    const linkClassName = roboto.className;

    return (
        <Layout.Navigation
            linkClassName={linkClassName}
            currentPathname={currentPathname}
        >
            <li className={styles.list_item}>
                {renderLink(currentPathname === '/profile', (attr) => (
                    <Link href='/profile' className={linkClassName} {...attr}>
                        <Icon type='account' color={Boolean(attr) ? 'orange' : 'black'} />
                            profile
                    </Link>
                ))}
            </li>
            <li className={styles.list_item}>
                {session?.user ? (
                    <QuestionCreateModalContainer
                        categories={categories}
                        toggleClassName={clsx(styles.listitemChild, linkClassName)}
                    >
                        <Icon type='write' />
                            post
                    </QuestionCreateModalContainer>
                ) : (
                    <button
                        className={clsx(styles.listitemChild, linkClassName)}
                        onClick={() => signIn()}
                    >
                        <Icon type='write' />
                            post
                    </button>
                )}
            </li>
        </Layout.Navigation>
    );
}