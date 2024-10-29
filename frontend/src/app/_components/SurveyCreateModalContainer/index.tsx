'use client';

import type { ReactNode } from 'react';
import { ModalContainer } from '@/app/_components/ModalContainer';
import { SurveyCreateModal } from '@/app/_components/SurveyCreateModal';
import { SurveyCreateForm } from '../SurveyCreateForm';

type Props = {
  children: ReactNode;
  toggleClassName?: string;
};

export function SurveyCreateModalContainer({
  children,
  toggleClassName,
}: Props) {
  return (
    <ModalContainer
      toggleClassName={toggleClassName}
      content={(closeModal) => (
        <SurveyCreateModal close={closeModal}>
          <SurveyCreateForm close={closeModal} />
        </SurveyCreateModal>
      )}
    >
      {children}
    </ModalContainer>
  );
}