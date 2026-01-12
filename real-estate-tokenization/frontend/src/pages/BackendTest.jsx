// frontend/src/pages/BackendTest.jsx
/**
 * Backend Testing Page
 * Check all backend services: Firebase, IPFS, Blockchain, Contract
 */
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const BackendTest = () => {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Backend API base URL
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

    useEffect(() => {
        checkHealth();
    }, []);

    const checkHealth = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE}/health`);
            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError('Cannot connect to backend: ' + err.message);
            // Try individual checks manually
            setResults({
                status: 'error',
                error: err.message,
                services: {}
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'connected': return '#10b981';
            case 'healthy': return '#10b981';
            case 'degraded': return '#f59e0b';
            case 'error': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'connected': return '✅';
            case 'healthy': return '✅';
            case 'degraded': return '⚠️';
            case 'error': return '❌';
            default: return '❔';
        }
    };

    return (
        <div>
            <Navbar />

            <main className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>
                    🔧 Backend Health Check
                </h1>
                <p style={{ color: '#6b7280', marginBottom: '30px' }}>
                    Test all backend services to ensure everything is working
                </p>

                <button
                    onClick={checkHealth}
                    className="btn-primary"
                    style={{ marginBottom: '30px' }}
                    disabled={loading}
                >
                    {loading ? 'Checking...' : '🔄 Refresh Check'}
                </button>

                {error && (
                    <div style={{
                        backgroundColor: '#fef2f2',
                        border: '1px solid #ef4444',
                        color: '#b91c1c',
                        padding: '15px 20px',
                        borderRadius: '8px',
                        marginBottom: '20px'
                    }}>
                        <strong>Error:</strong> {error}
                        <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                            Make sure the backend is running: <code>cd backend && npm start</code>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p>Checking backend services...</p>
                    </div>
                ) : results && (
                    <div>
                        {/* Overall Status */}
                        <div style={{
                            backgroundColor: getStatusColor(results.status) + '20',
                            border: `2px solid ${getStatusColor(results.status)}`,
                            padding: '20px',
                            borderRadius: '12px',
                            marginBottom: '30px',
                            textAlign: 'center'
                        }}>
                            <h2 style={{ color: getStatusColor(results.status), marginBottom: '5px' }}>
                                {getStatusIcon(results.status)} Overall: {results.status?.toUpperCase()}
                            </h2>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                                Last checked: {results.timestamp || new Date().toISOString()}
                            </p>
                        </div>

                        {/* Service Details */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                            {Object.entries(results.services || {}).map(([name, service]) => (
                                <div key={name} className="card" style={{
                                    padding: '20px',
                                    borderLeft: `4px solid ${getStatusColor(service.status)}`
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <h3 style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                                            {name.replace(/([A-Z])/g, ' $1').trim()}
                                        </h3>
                                        <span style={{
                                            backgroundColor: getStatusColor(service.status) + '20',
                                            color: getStatusColor(service.status),
                                            padding: '4px 10px',
                                            borderRadius: '12px',
                                            fontSize: '0.8rem',
                                            fontWeight: '600'
                                        }}>
                                            {getStatusIcon(service.status)} {service.status}
                                        </span>
                                    </div>

                                    <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                                        {service.message}
                                    </div>

                                    {/* Extra info for specific services */}
                                    {service.chainId && (
                                        <div style={{ marginTop: '10px', fontSize: '0.85rem' }}>
                                            <strong>Chain ID:</strong> {service.chainId}<br />
                                            <strong>Block:</strong> {service.blockNumber}
                                        </div>
                                    )}
                                    {service.address && (
                                        <div style={{ marginTop: '10px', fontSize: '0.8rem', wordBreak: 'break-all' }}>
                                            <strong>Address:</strong><br />
                                            <code>{service.address}</code>
                                        </div>
                                    )}
                                    {service.balance && (
                                        <div style={{ marginTop: '10px' }}>
                                            <strong>Balance:</strong> {service.balance}
                                            {service.lowBalance && (
                                                <span style={{ color: '#ef4444', marginLeft: '10px' }}>⚠️ Low!</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Manual Test Links */}
                        <div style={{ marginTop: '40px' }}>
                            <h3 style={{ marginBottom: '15px', fontWeight: '600' }}>📋 Manual Test URLs</h3>
                            <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '12px' }}>
                                <table style={{ width: '100%', fontSize: '0.9rem' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '8px 0', fontWeight: '500' }}>Full Health</td>
                                            <td><a href={`${API_BASE}/health`} target="_blank" rel="noopener">{API_BASE}/health</a></td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '8px 0', fontWeight: '500' }}>Firebase Only</td>
                                            <td><a href={`${API_BASE}/health/firebase`} target="_blank" rel="noopener">{API_BASE}/health/firebase</a></td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '8px 0', fontWeight: '500' }}>IPFS Only</td>
                                            <td><a href={`${API_BASE}/health/ipfs`} target="_blank" rel="noopener">{API_BASE}/health/ipfs</a></td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '8px 0', fontWeight: '500' }}>Blockchain Only</td>
                                            <td><a href={`${API_BASE}/health/blockchain`} target="_blank" rel="noopener">{API_BASE}/health/blockchain</a></td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '8px 0', fontWeight: '500' }}>Contract Only</td>
                                            <td><a href={`${API_BASE}/health/contract`} target="_blank" rel="noopener">{API_BASE}/health/contract</a></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Testing Checklist */}
                        <div style={{ marginTop: '40px' }}>
                            <h3 style={{ marginBottom: '15px', fontWeight: '600' }}>✅ Frontend Testing Checklist</h3>
                            <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '12px' }}>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li style={{ padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                                        <a href="/login" style={{ color: '#2563eb' }}>🔐 Login Page</a> - Test email/wallet login
                                    </li>
                                    <li style={{ padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                                        <a href="/marketplace" style={{ color: '#2563eb' }}>🏠 Marketplace</a> - Should show properties
                                    </li>
                                    <li style={{ padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                                        <a href="/resale" style={{ color: '#2563eb' }}>🔄 Resale Market</a> - Secondary market listings
                                    </li>
                                    <li style={{ padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                                        <a href="/my-shares" style={{ color: '#2563eb' }}>💼 My Shares</a> - View & sell owned shares
                                    </li>
                                    <li style={{ padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                                        <a href="/dashboard" style={{ color: '#2563eb' }}>📊 Dashboard</a> - User portfolio (needs login)
                                    </li>
                                    <li style={{ padding: '10px 0' }}>
                                        <a href="/admin" style={{ color: '#2563eb' }}>👑 Admin Console</a> - Property management (admin only)
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default BackendTest;
