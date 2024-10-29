import React from 'react';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import clsx from 'clsx';
import styles from './style.module.css';

type Props = ComponentPropsWithoutRef<'input'>;

export const DateField = forwardRef<HTMLInputElement, Props>(
  function DateFieldBase(
    { className, ...props }, ref) {
    return (
      <input
        type='date'
        {...props}
        ref={ref}
        className={clsx(styles.date_field, className)}
      />
    );
  },
);