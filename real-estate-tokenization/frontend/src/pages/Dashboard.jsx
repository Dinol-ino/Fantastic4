// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { Navigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { ethers } from 'ethers';
import TransactionHistory from '../components/TransactionHistory';
import SharesDisplay from '../components/SharesDisplay';
import { openCertificate, createCertificateData } from '../services/certificate';

const Dashboard = () => {
  const { currentUser, userData, logout, isAdmin } = useAuth();
  const { account, isConnected, connectWallet, provider } = useWallet();

  const [investments, setInvestments] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalInvested: 0, currentValue: 0, propertiesOwned: 0 });

  // Fetch user's investments from Firestore
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        // Fetch user's purchases
        const purchasesQuery = query(
          collection(db, 'purchases'),
          where('userId', '==', currentUser.uid),
          orderBy('timestamp', 'desc')
        );

        let purchases = [];
        try {
          const purchasesSnap = await getDocs(purchasesQuery);
          purchases = purchasesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) {
          console.log('No purchases collection yet');
        }

        // Fetch properties user has shares in
        const userSharesQuery = query(
          collection(db, 'userShares'),
          where('userId', '==', currentUser.uid)
        );

        let userShares = [];
        try {
          const sharesSnap = await getDocs(userSharesQuery);
          userShares = sharesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) {
          console.log('No userShares collection yet');
        }

        // Combine data
        const investmentMap = new Map();

        [...purchases, ...userShares].forEach(item => {
          const propId = item.propertyId;
          const existing = investmentMap.get(propId) || {
            propertyId: propId,
            propertyTitle: item.propertyTitle || `Property ${propId?.slice(-6)}`,
            shares: 0,
            totalInvested: 0,
            currentPrice: item.currentPrice || item.pricePerShare
          };

          existing.shares += item.shares || 0;
          existing.totalInvested += (item.shares || 0) * (item.pricePerShare || 0);
          investmentMap.set(propId, existing);
        });

        const investmentList = Array.from(investmentMap.values());
        setInvestments(investmentList);

        // Calculate stats
        const totalInvested = investmentList.reduce((sum, inv) => sum + inv.totalInvested, 0);
        const currentValue = investmentList.reduce((sum, inv) =>
          sum + (inv.shares * (inv.currentPrice || 0)), 0
        );

        setStats({
          totalInvested,
          currentValue: currentValue || totalInvested,
          propertiesOwned: investmentList.length
        });

        // Fetch admin's listed properties (if admin)
        if (isAdmin) {
          const propsQuery = query(
            collection(db, 'properties'),
            where('ownerUid', '==', currentUser.uid),
            limit(10)
          );
          try {
            const propsSnap = await getDocs(propsQuery);
            setProperties(propsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
          } catch (e) {
            console.log('No properties yet');
          }
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, isAdmin]);

  // Generate certificate for an investment
  const handleGenerateCertificate = (investment) => {
    const certData = {
      certificateId: `CERT-${Date.now().toString(36).toUpperCase()}`,
      ownerName: userData?.firstName || currentUser?.email?.split('@')[0] || 'Owner',
      ownerWallet: account || 'Not connected',
      propertyTitle: investment.propertyTitle,
      propertyId: investment.propertyId,
      shares: investment.shares,
      pricePerShare: (investment.totalInvested / investment.shares).toFixed(4),
      totalValue: investment.totalInvested.toFixed(4),
      purchaseDate: new Date().toLocaleDateString(),
      txHash: investment.txHash || '0x...',
      contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS
    };
    openCertificate(certData);
  };

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ background: '#0F1115', minHeight: '100vh' }}>
      <Navbar />

      <main className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>

        {/* Header */}
        <div className="flex justify-between" style={{ marginBottom: '50px', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '2.8rem', fontWeight: '700', marginBottom: '12px', color: '#F5F5F5' }}>
              Welcome back, {userData?.firstName || 'Investor'}
            </h1>
            <p style={{ color: '#A8A8A8', fontSize: '1.2rem' }}>
              {isAdmin ? 'Manage your property listings' : 'Your portfolio performance overview'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {isAdmin && (
              <Link to="/admin/create" className="btn-primary" style={{ padding: '14px 28px' }}>
                + List Property
              </Link>
            )}
            <button onClick={logout} className="btn-secondary" style={{ padding: '14px 28px' }}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Wallet Warning */}
        {!isConnected && (
          <div style={{
            backgroundColor: 'rgba(201, 162, 77, 0.1)',
            border: '1px solid rgba(201, 162, 77, 0.3)',
            color: '#C9A24D',
            padding: '20px 28px',
            borderRadius: '12px',
            marginBottom: '40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '1.1rem'
          }}>
            <span>Connect your MetaMask wallet to view blockchain data</span>
            <button onClick={connectWallet} style={{
              background: 'linear-gradient(135deg, #DDB85D 0%, #C9A24D 50%, #9A7A3A 100%)',
              color: '#0F1115',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '1rem'
            }}>
              Connect Wallet
            </button>
          </div>
        )}

        {/* Wallet Connected */}
        {isConnected && (
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#10b981',
            padding: '16px 24px',
            borderRadius: '12px',
            marginBottom: '40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '1.05rem'
          }}>
            <span>✓ Wallet: <code style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: '6px', color: '#34d399' }}>{account}</code></span>
            <a
              href={`https://amoy.polygonscan.com/address/${account}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#34d399', fontSize: '1rem' }}
            >
              View on PolygonScan →
            </a>
          </div>
        )}

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '50px' }}>
          <div style={{ background: '#1C1F26', border: '1px solid rgba(201,162,77,0.15)', borderRadius: '16px', padding: '28px 32px' }}>
            <div style={{ color: '#A8A8A8', fontSize: '1rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Invested</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#F5F5F5' }}>{stats.totalInvested.toFixed(4)} MATIC</div>
          </div>
          <div style={{ background: '#1C1F26', border: '1px solid rgba(201,162,77,0.15)', borderRadius: '16px', padding: '28px 32px' }}>
            <div style={{ color: '#A8A8A8', fontSize: '1rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current Valuation</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: stats.currentValue >= stats.totalInvested ? '#10b981' : '#ef4444' }}>
              {stats.currentValue.toFixed(4)} MATIC
            </div>
          </div>
          <div style={{ background: '#1C1F26', border: '1px solid rgba(201,162,77,0.15)', borderRadius: '16px', padding: '28px 32px' }}>
            <div style={{ color: '#A8A8A8', fontSize: '1rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Properties Owned</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#F5F5F5' }}>{stats.propertiesOwned}</div>
          </div>
        </div>

        {/* Investments Table */}
        <h3 style={{ fontSize: '1.6rem', marginBottom: '24px', fontWeight: '700', marginTop: '40px', color: '#F5F5F5' }}>
          Your Investments
        </h3>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#A8A8A8', fontSize: '1.1rem' }}>Loading...</div>
        ) : investments.length === 0 ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            backgroundColor: '#1C1F26',
            borderRadius: '16px',
            marginBottom: '40px',
            border: '1px solid rgba(201,162,77,0.1)'
          }}>
            <p style={{ color: '#A8A8A8', marginBottom: '24px', fontSize: '1.2rem' }}>No investments yet</p>
            <Link to="/marketplace" className="btn-primary">Browse Properties</Link>
          </div>
        ) : (
          <div style={{ marginBottom: '40px', overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Shares</th>
                  <th>Invested</th>
                  <th>Current Value</th>
                  <th>Return</th>
                  <th>Certificate</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => {
                  const currentVal = inv.shares * (inv.currentPrice || inv.totalInvested / inv.shares);
                  const gain = ((currentVal - inv.totalInvested) / inv.totalInvested * 100).toFixed(1);
                  const isPositive = currentVal >= inv.totalInvested;

                  return (
                    <tr key={inv.propertyId}>
                      <td style={{ fontWeight: '600' }}>{inv.propertyTitle}</td>
                      <td>{inv.shares}</td>
                      <td>{inv.totalInvested.toFixed(4)} MATIC</td>
                      <td style={{ fontWeight: '600' }}>{currentVal.toFixed(4)} MATIC</td>
                      <td>
                        <span className={`badge ${isPositive ? 'badge-green' : 'badge-red'}`}>
                          {isPositive ? '+' : ''}{gain}%
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleGenerateCertificate(inv)}
                          style={{
                            background: 'none',
                            border: '1px solid #2563eb',
                            color: '#2563eb',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          📜 Generate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Transaction History */}
        <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', fontWeight: '600' }}>
          Transaction History
        </h3>
        <div className="table-container">
          <TransactionHistory userId={currentUser?.uid} walletAddress={account} maxItems={10} />
        </div>

        {/* Admin: Listed Properties */}
        {isAdmin && properties.length > 0 && (
          <>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', fontWeight: '600', marginTop: '30px' }}>
              Your Listed Properties
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {properties.map(prop => (
                <div key={prop.id} className="card" style={{ padding: '20px' }}>
                  <h4>{prop.title}</h4>
                  <SharesDisplay
                    totalShares={prop.totalShares}
                    availableShares={prop.availableShares}
                    pricePerShare={prop.currentPrice || prop.pricePerShare}
                    size="small"
                  />
                  <Link to={`/property/${prop.id}`} style={{ color: '#2563eb', fontSize: '0.9rem' }}>
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

      </main>
    </div>
  );
};

export default Dashboard;