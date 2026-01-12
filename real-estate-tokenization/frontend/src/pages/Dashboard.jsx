// src/pages/Dashboard.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

// Mock Data
const MOCK_INVESTMENTS = [
  { id: 1, title: "Luxury Apartment #402", location: "Mumbai, India", invested: 50, shares: 10, currentValue: 55, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=100&q=80" },
  { id: 2, title: "Oceanview Villa", location: "Goa, India", invested: 120, shares: 5, currentValue: 135, image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=100&q=80" },
];

const Dashboard = () => {
  const { currentUser, userData, logout } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Calculate Totals
  const totalInvested = MOCK_INVESTMENTS.reduce((acc, item) => acc + item.invested, 0);
  const totalValue = MOCK_INVESTMENTS.reduce((acc, item) => acc + item.currentValue, 0);

  return (
    <div>
      <Navbar />
      
      <main className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
        
        {/* Header */}
        <div className="flex justify-between" style={{ marginBottom: '30px', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '5px' }}>
              Welcome back, {userData ? userData.firstName : 'Investor'}
            </h1>
            <p style={{ color: '#666' }}>Here is your portfolio performance overview.</p>
          </div>
          <button onClick={logout} className="btn-secondary" style={{ padding: '8px 20px' }}>
            Sign Out
          </button>
        </div>

        {/* Stats Row */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Invested</div>
            <div className="stat-value">{totalInvested} MATIC</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Current Valuation</div>
            <div className="stat-value" style={{ color: '#10b981' }}>{totalValue} MATIC</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Properties</div>
            <div className="stat-value">{MOCK_INVESTMENTS.length}</div>
          </div>
        </div>

        {/* Assets Table */}
        <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', fontWeight: '600' }}>Your Assets</h3>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Shares</th>
                <th>Avg. Cost</th>
                <th>Current Value</th>
                <th>Return</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_INVESTMENTS.map((asset) => {
                const gain = ((asset.currentValue - asset.invested) / asset.invested * 100).toFixed(1);
                const isPositive = asset.currentValue >= asset.invested;

                return (
                  <tr key={asset.id}>
                    <td>
                      <div className="asset-info">
                        <img src={asset.image} alt="" className="asset-img" />
                        <div>
                          <div style={{ fontWeight: '600', color: '#111827' }}>{asset.title}</div>
                          <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{asset.location}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#4b5563' }}>{asset.shares}</td>
                    <td style={{ color: '#4b5563' }}>{asset.invested / asset.shares} MATIC</td>
                    <td style={{ fontWeight: '600' }}>{asset.currentValue} MATIC</td>
                    <td>
                      <span className={`badge ${isPositive ? 'badge-green' : 'badge-red'}`}>
                        {isPositive ? '+' : ''}{gain}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;