'use client';

import type { ReactNode } from 'react';
import { ModalContainer } from '@/app/_components/ModalContainer';
import { QuestionCreateModal } from '@/app/_components/QuestionCreateModal';
import type { GetCategoriesResponse } from '@/services/getCategories';
import { QuestionCreateForm } from '../QuestionCreateForm';

type Props = {
    children: ReactNode;
    toggleClassName?: string;
} & GetCategoriesResponse;

export function QuestionCreateModalContainer({
    categories,
    children,
    toggleClassName,
}: Props) {
    return (
        <ModalContainer
            toggleClassName={toggleClassName}
            content={(closeModal) => (
                <QuestionCreateModal close={closeModal}>
                    <QuestionCreateForm categories={categories} close={closeModal} />
                </QuestionCreateModal>
            )}
        >
            {children}
        </ModalContainer>
    );
}