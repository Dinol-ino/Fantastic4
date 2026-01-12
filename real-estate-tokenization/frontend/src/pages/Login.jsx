// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../services/firebase';
import { useWallet } from '../context/WalletContext'; // Import Wallet Context

const Login = () => {
  const navigate = useNavigate();
  const { connectWallet, account } = useWallet(); // Get wallet functions
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to Admin Create page if Admin, or Marketplace if User
      navigate('/admin/create'); 
    } catch (err) {
      alert("Login Failed: " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-center" style={{ marginBottom: '20px' }}>Welcome Back</h2>
        
        <form onSubmit={handleSubmit}>
          {/* ... existing email/password inputs ... */}
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-input" onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
             <label>Password</label>
             <input type="password" className="form-input" onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn-primary btn-full">Sign In</button>
        </form>

        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <p className="text-center" style={{ fontSize: '0.9rem', marginBottom: '10px' }}>
            Also connect your wallet
          </p>
          <button 
            onClick={connectWallet}
            type="button"
            className="btn-secondary btn-full"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" width="20" alt="MetaMask" />
            {account ? `Connected: ${account.slice(0,6)}...` : "Connect MetaMask"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;