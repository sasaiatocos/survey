import React from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { Icon } from '../Icon';
import styles from './style.module.css';

type Props = {
  title?: string;
  expiredAt?: string;
  rounded?: boolean;
  ratio?: 'wide' | 'square' | 'portrait';
  fit?: 'cover' | 'contain';
  size?: 'small' | 'medium' | 'large';
  actionIcon?: {
    iconProps: React.ComponentProps<typeof Icon>;
    containerProps?: React.ComponentProps<'div'>;
  };
  showMeta?: boolean;
  animate?: boolean;
  lineClamp?: 1 | 2 | 3 | 4;
  priority?: boolean;
};

const sizes = {
  large: { width: 960, height: 640 },
  medium: { width: 420, height: 280 },
  small: { width: 180, height: 120 },
};

const disabledNextImage = process.env.NEXT_PUBLIC_DISABLE_NEXT_IMAGE === 'true';

export function SurveyCard({
  ratio = 'wide',
  fit = 'cover',
  size = 'medium',
  actionIcon,
  rounded = true,
  showMeta = true,
  animate = true,
  lineClamp = 1,
  priority,
  ...survey
}: Props) {
  return (
    <div
      className={clsx(
        styles.card,
        styles[ratio],
        styles[fit],
        rounded && styles.rounded,
      )}
    >
      {showMeta && (
        <div className={clsx(styles.meta, animate && styles.animate)}>
          <p className={styles.title}>{survey.title}</p>
          <p
            className={clsx(
              styles.description,
              styles[`lineClamp${lineClamp}`],
            )}
          >
            {survey.expiredAt}
          </p>
        </div>
      )}
      {actionIcon && (
        <div
          {...actionIcon.containerProps}
          className={clsx(
            actionIcon.containerProps?.className,
            styles.actionIcon,
            animate && styles.animate,
          )}
        >
          <Icon {...actionIcon.iconProps} />
        </div>
      )}
    </div>
  );
}