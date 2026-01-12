// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';

const Navbar = () => {
  const { currentUser, userData, logout } = useAuth();
  const { account, isConnected, connectWallet } = useWallet();

  return (
    <nav className="navbar">
      <div className="container flex justify-between" style={{ height: '100%', alignItems: 'center' }}>
        <Link to="/" className="nav-logo">
          <img src="/assets/logo.jpg" alt="Aurelian Logo" style={{ height: '68px', width: 'auto' }} />
          AURELIAN
        </Link>

        {/* Desktop Links */}
        <div className="nav-links flex items-center">
          <a href="/#process">How it Works</a>
          <Link to="/marketplace">Marketplace</Link>

          {currentUser ? (
            <>
              <Link to="/sell" style={{ color: currentUser ? '#d4af37' : '' }}>Sell</Link>
              <Link to="/resale">Resale</Link>
              <Link to="/my-shares">My Shares</Link>
              {userData?.role === 'admin' && (
                <Link to="/admin" className="text-gradient-gold">Admin</Link>
              )}
              <Link to="/dashboard">Dashboard</Link>

              {/* Wallet Status / Connect */}
              {isConnected ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '6px 16px',
                  borderRadius: '30px',
                  border: '1px solid var(--border-light)',
                  marginLeft: '20px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    marginRight: '8px',
                    boxShadow: '0 0 8px #10b981'
                  }} />
                  <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#e5e7eb' }}>
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="btn-primary"
                  style={{ marginLeft: '20px', padding: '8px 20px', fontSize: '0.85rem' }}
                >
                  Connect Wallet
                </button>
              )}

              <button
                onClick={logout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  marginLeft: '20px',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.color = '#fff'}
                onMouseOut={(e) => e.target.style.color = '#6b7280'}
              >
                Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '8px 20px', border: 'none' }}>Log In</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 20px' }}>Join Aurelian</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;