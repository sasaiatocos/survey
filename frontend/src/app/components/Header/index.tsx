import React from 'react';
import Navigation from '../Navigation';
import { useAuth } from '../AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <header>
      <div className="header-content">
        <h1>Survey App</h1>
        <Navigation isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={logout} />
      </div>
    </header>
  );
};

export default Header;

