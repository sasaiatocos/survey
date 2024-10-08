'use client';

import type { ReactNode } from 'react';
import { ModalContainer } from '@/app/_components/ModalContainer';
import { QuestionCreateModal } from '@/app/_components/QuestionCreateModal';
import { QuestionCreateForm } from '../QuestionCreateForm';

type Props = {
    children: ReactNode;
    toggleClassName?: string;
};

export function QuestionCreateModalContainer({
    children,
    toggleClassName,
}: Props) {
  return (
    <ModalContainer
      toggleClassName={toggleClassName}
      content={(closeModal) => (
        <QuestionCreateModal close={closeModal}>
          <QuestionCreateForm close={closeModal} />
        </QuestionCreateModal>
      )}
    >
      {children}
    </ModalContainer>
  );
}