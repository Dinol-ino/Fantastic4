// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, userData } = useAuth();
  const { connectWallet, account, isConnected, connecting } = useWallet();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);

      // Role-based redirect will happen after userData loads
      // For now, redirect to dashboard (protected route will handle the rest)
      navigate('/dashboard');

    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = err.message.replace('Firebase: ', '');
      if (errorMessage.includes('auth/invalid-credential')) {
        errorMessage = 'Invalid email or password';
      } else if (errorMessage.includes('auth/user-not-found')) {
        errorMessage = 'No account found with this email';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '50px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src="/assets/logo.jpg" alt="Aurelian" style={{ height: '50px', margin: '0 auto 24px', display: 'block' }} />
          <h2 style={{ fontSize: '2.2rem', fontWeight: '700', marginBottom: '14px', color: '#d4af37' }}>Welcome Back</h2>
          <p style={{ color: '#888', fontSize: '1.15rem' }}>Sign in to access your portfolio</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          marginTop: '30px',
          borderTop: '1px solid var(--border-light)',
          paddingTop: '25px'
        }}>
          <p className="text-center" style={{ fontSize: '0.85rem', marginBottom: '15px', color: '#71717a' }}>
            Connect your wallet for blockchain transactions
          </p>
          <button
            onClick={connectWallet}
            type="button"
            className="btn-secondary"
            disabled={connecting}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              opacity: connecting ? 0.7 : 1
            }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
              width="20"
              alt="MetaMask"
            />
            {connecting
              ? "Connecting..."
              : isConnected
                ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
                : "Connect MetaMask"
            }
          </button>
        </div>

        <p className="text-center" style={{ marginTop: '20px', fontSize: '0.9rem', color: '#a1a1aa' }}>
          Don't have an account? <Link to="/register" style={{ color: '#d4af37', textDecoration: 'none' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;