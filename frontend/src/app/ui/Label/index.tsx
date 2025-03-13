import React from 'react';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import clsx from 'clsx';
import styles from './style.module.css';

type Props = ComponentPropsWithoutRef<'label'> & {
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  children: React.ReactNode;
};

export const Label = forwardRef<HTMLLabelElement, Props>(function LabelBase(
  { size = 'medium', className, children, ...props },
  ref,
) {
  return (
    <label
      {...props}
      ref={ref}
      className={clsx(styles.label, styles[size], className)}
    >
      {children}
    </label>
  );
});