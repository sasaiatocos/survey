import React from 'react';
import { Typography } from '../../Typography';
import styles from './style.module.css';

export function Footer() {
    return (
        <footer className={styles.footer}>
            <Typography size='small' className={styles.copyright}>
                © sasai atocos. All rights reserved.
            </Typography>
        </footer>
    );
}