// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from '../services/firebase';

const Register = () => {
  const navigate = useNavigate();
  
  // State Variables
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    setLoading(true);
    console.log("Step 1: Starting Registration...");

    try {
      // 1. Create User in Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      console.log("Step 2: Auth Successful for UID:", user.uid);

      // 2. Create User in Firestore
      console.log("Step 3: Attempting to write to Firestore...");
      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: 'investor', 
        walletAddress: null, 
        createdAt: serverTimestamp()
      });
      
      console.log("Step 4: Firestore Write Successful!");
      
      // 3. Redirect
      navigate('/dashboard');

    } catch (err) {
      console.error("REGISTRATION ERROR:", err);
      // Show specific error to user
      let cleanError = err.message.replace('Firebase: ', '');
      if (cleanError.includes('permission-denied')) {
        cleanError = "Database Permission Denied. Check Firestore Rules.";
      }
      setError(cleanError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-center" style={{ marginBottom: '20px' }}>Create Account</h2>
        
        {/* Error Message Display */}
        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>First Name</label>
              <input name="firstName" type="text" className="form-input" required onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input name="lastName" type="text" className="form-input" required onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" className="form-input" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" className="form-input" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input name="confirmPassword" type="password" className="form-input" required onChange={handleChange} />
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <p className="text-center" style={{ marginTop: '20px', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;