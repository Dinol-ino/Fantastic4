// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, updateWalletAddress } = useAuth();
  const { connectWallet, account, isConnected } = useWallet();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'investor' // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Register user with Firebase Auth and Firestore
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.role
      );

      // If wallet is connected, save the address
      if (isConnected && account) {
        await updateWalletAddress(account);
      }

      // Redirect based on role
      if (formData.role === 'admin') {
        navigate('/admin/create');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      console.error("Registration error:", err);
      let cleanError = err.message.replace('Firebase: ', '');
      if (cleanError.includes('email-already-in-use')) {
        cleanError = "An account with this email already exists";
      }
      setError(cleanError);
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
      padding: '60px 20px'
    }}>
      <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '50px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src="/assets/logo.jpg" alt="Aurelian" style={{ height: '80px', margin: '0 auto 24px', display: 'block' }} />
          <h2 style={{ fontSize: '2.2rem', fontWeight: '700', marginBottom: '14px', color: '#d4af37' }}>Create Account</h2>
          <p style={{ color: '#888', fontSize: '1.15rem' }}>Start investing in tokenized real estate</p>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>First Name</label>
              <input
                name="firstName"
                type="text"
                className="form-input"
                required
                onChange={handleChange}
                placeholder="John"
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                name="lastName"
                type="text"
                className="form-input"
                required
                onChange={handleChange}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              className="form-input"
              required
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label>I want to</label>
            <select
              name="role"
              className="form-input"
              value={formData.role}
              onChange={handleChange}
              style={{ cursor: 'pointer' }}
            >
              <option value="investor">Invest in Properties</option>
              <option value="admin">List Properties for Sale</option>
            </select>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              className="form-input"
              required
              onChange={handleChange}
              placeholder="At least 6 characters"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              className="form-input"
              required
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          {/* Wallet Connection Section */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-light)',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <p style={{ fontSize: '0.85rem', marginBottom: '10px', color: '#a1a1aa' }}>
              <strong>Optional:</strong> Connect your MetaMask wallet
            </p>
            <button
              onClick={connectWallet}
              type="button"
              className="btn-secondary"
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                padding: '10px'
              }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                width="18"
                alt="MetaMask"
              />
              {isConnected
                ? `${account.slice(0, 6)}...${account.slice(-4)}`
                : "Connect Wallet"
              }
            </button>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center" style={{ marginTop: '20px', fontSize: '0.9rem', color: '#a1a1aa' }}>
          Already have an account? <Link to="/login" style={{ color: '#d4af37', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;