import React from 'react';
import { Icon } from '../Icon';
import styles from './style.module.css';
import { AlertText } from '../AlertText';

type Props = {
  children: React.ReactNode;
  id?: string;
};

export function AlertLabel({ children, id }: Props) {
  return (
    <AlertText className={styles.label} id={id}>
      <Icon type='alert' color='orange' size='xsmall' />
      {children}
    </AlertText>
  );
}