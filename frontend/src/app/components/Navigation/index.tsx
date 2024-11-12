'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../AuthContext';

type NavigationProps = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLogout: () => void;
};

const Navigation: React.FC<NavigationProps> = ({ isAuthenticated, isAdmin, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className={`navigation ${isMobileMenuOpen ? 'open' : ''}`}>
      <div className="menu-toggle" onClick={toggleMobileMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
      <ul className="menu">
        <li>
          <Link href="/">ホーム</Link>
        </li>
        {isAuthenticated && (
          <>
            <li>
              <Link href="/survey/create">アンケート作成</Link>
            </li>
            <li>
              <Link href="/surveys">アンケート一覧</Link>
            </li>
            {isAdmin && (
              <li>
                <Link href="/admin">管理者ページ</Link>
              </li>
            )}
            <li>
              <button onClick={onLogout}>ログアウト</button>
            </li>
          </>
        )}
        {!isAuthenticated && (
          <li>
            <Link href="/login">ログイン</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;