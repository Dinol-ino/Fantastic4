// frontend/src/pages/MyShares.jsx
/**
 * MyShares Page
 * Users can view their owned shares and list them for resale
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import Navbar from '../components/Navbar';
import { listForResale, CONTRACT_ADDRESS } from '../services/contract';

const MyShares = () => {
    const navigate = useNavigate();
    const { currentUser, userData } = useAuth();
    const { account, isConnected, connectWallet, signer, isAmoy } = useWallet();

    const [ownedShares, setOwnedShares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sellModal, setSellModal] = useState(null); // { propertyId, propertyTitle, availableShares }
    const [sellForm, setSellForm] = useState({ shares: '', price: '' });
    const [selling, setSelling] = useState(false);
    const [status, setStatus] = useState('');

    // Fetch user's owned shares
    useEffect(() => {
        const fetchShares = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            try {
                // Aggregate from purchases
                const purchasesQuery = query(
                    collection(db, 'purchases'),
                    where('userId', '==', currentUser.uid)
                );
                const purchasesSnap = await getDocs(purchasesQuery);

                // Group by property
                const sharesMap = new Map();

                purchasesSnap.docs.forEach(doc => {
                    const data = doc.data();
                    const propId = data.propertyId;
                    const existing = sharesMap.get(propId) || {
                        propertyId: propId,
                        propertyTitle: data.propertyTitle || `Property ${propId?.slice(-6)}`,
                        totalShares: 0,
                        avgPrice: 0,
                        totalSpent: 0,
                        purchases: []
                    };

                    existing.totalShares += data.shares || 0;
                    existing.totalSpent += data.totalCost || 0;
                    existing.purchases.push(data);
                    sharesMap.set(propId, existing);
                });

                // Check for active resale listings (shares currently listed)
                const resalesQuery = query(
                    collection(db, 'resaleListings'),
                    where('sellerUid', '==', currentUser.uid),
                    where('isActive', '==', true)
                );
                const resalesSnap = await getDocs(resalesQuery);

                const listedShares = new Map();
                resalesSnap.docs.forEach(doc => {
                    const data = doc.data();
                    const current = listedShares.get(data.propertyId) || 0;
                    listedShares.set(data.propertyId, current + (data.sharesForSale - data.sharesSold));
                });

                // Calculate available shares (owned - listed)
                const sharesList = Array.from(sharesMap.values()).map(item => ({
                    ...item,
                    avgPrice: item.totalShares > 0 ? (item.totalSpent / item.totalShares).toFixed(4) : 0,
                    listedShares: listedShares.get(item.propertyId) || 0,
                    availableToSell: item.totalShares - (listedShares.get(item.propertyId) || 0)
                }));

                setOwnedShares(sharesList);
            } catch (error) {
                console.error('Error fetching shares:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchShares();
    }, [currentUser]);

    // Handle sell listing
    const handleSell = async (e) => {
        e.preventDefault();

        if (!isConnected) {
            alert('Please connect your wallet');
            return;
        }

        if (!isAmoy) {
            alert('Please switch to Polygon Amoy network');
            return;
        }

        const shares = parseInt(sellForm.shares);
        const price = parseFloat(sellForm.price);

        if (!shares || shares <= 0 || shares > sellModal.availableShares) {
            alert(`Enter valid shares (1 - ${sellModal.availableShares})`);
            return;
        }

        if (!price || price <= 0) {
            alert('Enter valid price per share');
            return;
        }

        setSelling(true);
        setStatus('Creating resale listing...');

        try {
            // Call smart contract if blockchain ID exists
            let txHash = null;
            if (sellModal.blockchainId !== undefined) {
                setStatus('Please confirm in MetaMask...');
                const result = await listForResale(signer, sellModal.blockchainId, shares, price);
                txHash = result.txHash;
            } else {
                // Demo mode - simulate tx
                txHash = '0x' + Math.random().toString(16).slice(2) + Date.now().toString(16);
            }

            setStatus('Saving listing...');

            // Save to Firestore
            await addDoc(collection(db, 'resaleListings'), {
                propertyId: sellModal.propertyId,
                propertyTitle: sellModal.propertyTitle,
                sellerUid: currentUser.uid,
                sellerWallet: account,
                sellerEmail: currentUser.email,
                sharesForSale: shares,
                pricePerShare: price,
                sharesSold: 0,
                totalValue: shares * price,
                isActive: true,
                txHash: txHash,
                createdAt: serverTimestamp()
            });

            setStatus('Listed successfully! 🎉');

            setTimeout(() => {
                setSellModal(null);
                setSellForm({ shares: '', price: '' });
                window.location.reload();
            }, 1500);

        } catch (error) {
            console.error('Sell failed:', error);
            setStatus('Failed: ' + (error.reason || error.message));
        } finally {
            setTimeout(() => setSelling(false), 2000);
        }
    };

    if (!currentUser) {
        return (
            <div style={{ background: '#0F1115', minHeight: '100vh' }}>
                <Navbar />
                <div className="container" style={{ paddingTop: '140px', textAlign: 'center' }}>
                    <h2 style={{ color: '#F5F5F5', fontSize: '2.5rem', fontWeight: '700' }}>Please Login</h2>
                    <Link to="/login" className="btn-primary" style={{ marginTop: '32px', display: 'inline-block' }}>Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#0F1115', minHeight: '100vh' }}>
            <Navbar />

            <main className="container" style={{ paddingTop: '140px', paddingBottom: '100px' }}>
                {/* Header */}
                <div style={{ marginBottom: '50px' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '16px', color: '#C9A24D' }}>
                        My Shares
                    </h1>
                    <p style={{ color: '#A8A8A8', fontSize: '1.3rem' }}>
                        View your owned property shares and list them for resale
                    </p>
                </div>

                {/* Wallet Warning */}
                {!isConnected && (
                    <div style={{
                        backgroundColor: 'rgba(201, 162, 77, 0.1)',
                        border: '1px solid rgba(201, 162, 77, 0.3)',
                        color: '#C9A24D',
                        padding: '24px 32px',
                        borderRadius: '16px',
                        marginBottom: '40px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '1.15rem'
                    }}>
                        <span>Connect wallet to sell shares</span>
                        <button onClick={connectWallet} className="btn-primary" style={{ padding: '12px 28px' }}>
                            Connect
                        </button>
                    </div>
                )}

                {/* Shares List */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px', color: '#A8A8A8', fontSize: '1.3rem' }}>
                        Loading your shares...
                    </div>
                ) : ownedShares.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px',
                        backgroundColor: '#1C1F26',
                        borderRadius: '20px',
                        border: '1px solid rgba(201,162,77,0.1)'
                    }}>
                        <h3 style={{ color: '#F5F5F5', fontSize: '2rem', fontWeight: '700' }}>No Shares Owned</h3>
                        <p style={{ color: '#A8A8A8', marginTop: '16px', fontSize: '1.2rem' }}>
                            Buy property shares to see them here
                        </p>
                        <Link to="/marketplace" className="btn-primary" style={{ marginTop: '32px', display: 'inline-block' }}>
                            Browse Properties
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '28px' }}>
                        {ownedShares.map(share => (
                            <div key={share.propertyId} className="card" style={{ padding: '36px' }}>
                                <h3 style={{ marginBottom: '24px', fontWeight: '700', color: '#F5F5F5', fontSize: '1.6rem' }}>
                                    {share.propertyTitle}
                                </h3>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '14px',
                                    marginBottom: '28px'
                                }}>
                                    <div style={{ backgroundColor: '#252830', padding: '18px', borderRadius: '14px' }}>
                                        <div style={{ fontSize: '0.95rem', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Owned</div>
                                        <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#C9A24D' }}>
                                            {share.totalShares}
                                        </div>
                                    </div>
                                    <div style={{ backgroundColor: '#252830', padding: '18px', borderRadius: '14px' }}>
                                        <div style={{ fontSize: '0.95rem', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Avg. Cost</div>
                                        <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#F5F5F5' }}>
                                            {share.avgPrice} MATIC
                                        </div>
                                    </div>
                                    <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', padding: '18px', borderRadius: '14px' }}>
                                        <div style={{ fontSize: '0.95rem', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Available to Sell</div>
                                        <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#10b981' }}>
                                            {share.availableToSell}
                                        </div>
                                    </div>
                                    <div style={{ backgroundColor: 'rgba(201,162,77,0.1)', padding: '18px', borderRadius: '14px' }}>
                                        <div style={{ fontSize: '0.95rem', color: '#C9A24D', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Listed for Sale</div>
                                        <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#C9A24D' }}>
                                            {share.listedShares}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '14px' }}>
                                    <Link
                                        to={`/property/${share.propertyId}`}
                                        className="btn-secondary"
                                        style={{ flex: 1, textAlign: 'center', padding: '14px' }}
                                    >
                                        View
                                    </Link>
                                    <button
                                        onClick={() => setSellModal({
                                            propertyId: share.propertyId,
                                            propertyTitle: share.propertyTitle,
                                            availableShares: share.availableToSell,
                                            avgPrice: share.avgPrice
                                        })}
                                        disabled={share.availableToSell <= 0 || !isConnected}
                                        className="btn-primary"
                                        style={{ flex: 1, padding: '14px' }}
                                    >
                                        Sell Shares
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quick Links */}
                <div style={{ marginTop: '60px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <Link to="/resale" className="btn-secondary">
                        Browse Resale Marketplace →
                    </Link>
                    <Link to="/dashboard" className="btn-secondary">
                        View Dashboard →
                    </Link>
                </div>
            </main>

            {/* Sell Modal */}
            {sellModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: '#1C1F26',
                        borderRadius: '20px',
                        padding: '44px',
                        width: '90%',
                        maxWidth: '500px',
                        border: '1px solid rgba(201,162,77,0.2)'
                    }}>
                        <h3 style={{ marginBottom: '24px', fontSize: '2rem', fontWeight: '700', color: '#C9A24D' }}>Sell Shares</h3>
                        <p style={{ color: '#A8A8A8', marginBottom: '28px', fontSize: '1.2rem' }}>
                            {sellModal.propertyTitle}
                        </p>

                        {status && (
                            <div style={{
                                padding: '16px',
                                borderRadius: '12px',
                                marginBottom: '20px',
                                backgroundColor: status.includes('Failed') ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                                border: `1px solid ${status.includes('Failed') ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
                                color: status.includes('Failed') ? '#ef4444' : '#10b981',
                                textAlign: 'center',
                                fontSize: '1.1rem'
                            }}>
                                {status}
                            </div>
                        )}

                        <form onSubmit={handleSell}>
                            <div className="form-group">
                                <label>
                                    Shares to Sell (max: {sellModal.availableShares})
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={sellModal.availableShares}
                                    value={sellForm.shares}
                                    onChange={(e) => setSellForm({ ...sellForm, shares: e.target.value })}
                                    className="form-input"
                                    placeholder="10"
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontWeight: '500', marginBottom: '5px', display: 'block' }}>
                                    Price Per Share (MATIC)
                                </label>
                                <input
                                    type="number"
                                    step="0.001"
                                    min="0.001"
                                    value={sellForm.price}
                                    onChange={(e) => setSellForm({ ...sellForm, price: e.target.value })}
                                    className="form-input"
                                    placeholder={sellModal.avgPrice || '0.5'}
                                    required
                                />
                                <small style={{ color: '#6b7280' }}>
                                    Your avg. cost: {sellModal.avgPrice} MATIC
                                </small>
                            </div>

                            {sellForm.shares && sellForm.price && (
                                <div style={{
                                    backgroundColor: '#f0fdf4',
                                    color: '#1f2937',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: '1px solid #10b981',
                                    marginTop: '16px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <span>Total if sold:</span>
                                        <strong style={{ color: '#10b981' }}>
                                            {(parseFloat(sellForm.price) * parseInt(sellForm.shares)).toFixed(4)} MATIC
                                        </strong>
                                    </div>
                                    {parseFloat(sellForm.price) > parseFloat(sellModal.avgPrice) && (
                                        <div style={{ fontSize: '0.85rem', color: '#10b981' }}>
                                            ↑ Profit: {((parseFloat(sellForm.price) - parseFloat(sellModal.avgPrice)) * parseInt(sellForm.shares)).toFixed(4)} MATIC
                                        </div>
                                    )}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => { setSellModal(null); setSellForm({ shares: '', price: '' }); setStatus(''); }}
                                    className="btn-secondary"
                                    style={{ flex: 1, padding: '12px' }}
                                    disabled={selling}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{ flex: 1, padding: '12px' }}
                                    disabled={selling || !isConnected}
                                >
                                    {selling ? 'Listing...' : 'List for Sale'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyShares;
