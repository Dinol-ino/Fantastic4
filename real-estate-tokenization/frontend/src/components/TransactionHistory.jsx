// frontend/src/components/TransactionHistory.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * TransactionHistory Component
 * Displays user's transaction history with blockchain verification links
 */
const TransactionHistory = ({ userId, walletAddress, maxItems = 10 }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!userId && !walletAddress) {
                setLoading(false);
                return;
            }

            try {
                // Fetch from multiple collections
                const txCollections = ['purchases', 'resaleHistory', 'transactions'];
                let allTx = [];

                for (const collName of txCollections) {
                    try {
                        const q = query(
                            collection(db, collName),
                            orderBy('timestamp', 'desc'),
                            limit(20)
                        );
                        const snap = await getDocs(q);
                        const txs = snap.docs.map(d => ({
                            id: d.id,
                            type: collName === 'purchases' ? 'BUY' : collName === 'resaleHistory' ? 'RESALE' : 'TX',
                            ...d.data()
                        }));

                        // Filter for this user
                        const userTxs = txs.filter(tx =>
                            tx.buyerWallet?.toLowerCase() === walletAddress?.toLowerCase() ||
                            tx.sellerWallet?.toLowerCase() === walletAddress?.toLowerCase() ||
                            tx.userId === userId ||
                            tx.buyer?.toLowerCase() === walletAddress?.toLowerCase() ||
                            tx.seller?.toLowerCase() === walletAddress?.toLowerCase()
                        );

                        allTx = [...allTx, ...userTxs];
                    } catch (e) {
                        // Collection might not exist yet
                    }
                }

                // Sort by timestamp and limit
                allTx.sort((a, b) => {
                    const timeA = a.timestamp?.toDate?.()?.getTime() || new Date(a.timestamp).getTime() || 0;
                    const timeB = b.timestamp?.toDate?.()?.getTime() || new Date(b.timestamp).getTime() || 0;
                    return timeB - timeA;
                });

                setTransactions(allTx.slice(0, maxItems));
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [userId, walletAddress, maxItems]);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate?.() || new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getTypeColor = (type, isIncoming) => {
        if (type === 'BUY') return '#10b981';
        if (type === 'RESALE') return isIncoming ? '#10b981' : '#f59e0b';
        return '#6b7280';
    };

    const getTypeLabel = (tx) => {
        if (tx.type === 'BUY') return 'Purchased';
        if (tx.type === 'RESALE') {
            return tx.buyer?.toLowerCase() === walletAddress?.toLowerCase() ? 'Bought (Resale)' : 'Sold (Resale)';
        }
        return 'Transaction';
    };

    if (loading) {
        return (
            <div style={{ padding: '24px', textAlign: 'center', color: '#A8A8A8', fontSize: '1.1rem' }}>
                Loading transactions...
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div style={{
                padding: '40px',
                textAlign: 'center',
                backgroundColor: '#1C1F26',
                borderRadius: '16px',
                color: '#A8A8A8',
                border: '1px solid rgba(201,162,77,0.1)'
            }}>
                <p style={{ fontSize: '1.1rem', color: '#F5F5F5' }}>No transactions yet</p>
                <p style={{ fontSize: '1rem', marginTop: '8px' }}>
                    Your purchases and sales will appear here
                </p>
            </div>
        );
    }

    return (
        <div style={{ overflowX: 'auto', backgroundColor: '#1C1F26', borderRadius: '16px', border: '1px solid rgba(201,162,77,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid rgba(201,162,77,0.15)' }}>
                        <th style={{ textAlign: 'left', padding: '18px 16px', color: '#C9A24D', fontWeight: '700', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Type</th>
                        <th style={{ textAlign: 'left', padding: '18px 16px', color: '#C9A24D', fontWeight: '700', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Property</th>
                        <th style={{ textAlign: 'right', padding: '18px 16px', color: '#C9A24D', fontWeight: '700', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Shares</th>
                        <th style={{ textAlign: 'right', padding: '18px 16px', color: '#C9A24D', fontWeight: '700', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Amount</th>
                        <th style={{ textAlign: 'left', padding: '18px 16px', color: '#C9A24D', fontWeight: '700', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date</th>
                        <th style={{ textAlign: 'center', padding: '18px 16px', color: '#C9A24D', fontWeight: '700', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Verify</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx) => {
                        const isIncoming = tx.buyer?.toLowerCase() === walletAddress?.toLowerCase();
                        return (
                            <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '16px' }}>
                                    <span style={{
                                        backgroundColor: getTypeColor(tx.type, isIncoming) + '20',
                                        color: getTypeColor(tx.type, isIncoming),
                                        padding: '6px 14px',
                                        borderRadius: '12px',
                                        fontSize: '0.9rem',
                                        fontWeight: '600'
                                    }}>
                                        {getTypeLabel(tx)}
                                    </span>
                                </td>
                                <td style={{ padding: '16px', color: '#F5F5F5', fontSize: '1rem' }}>
                                    {tx.propertyTitle || `Property #${tx.propertyId?.slice(-6) || 'N/A'}`}
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right', fontWeight: '700', color: '#F5F5F5', fontSize: '1rem' }}>
                                    {tx.shares || tx.sharesToBuy || '-'}
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right', color: '#C9A24D', fontWeight: '700', fontSize: '1rem' }}>
                                    {(tx.totalCost || tx.pricePerShare * tx.shares || 0).toFixed(4)} MATIC
                                </td>
                                <td style={{ padding: '16px', color: '#A8A8A8', fontSize: '0.95rem' }}>
                                    {formatDate(tx.timestamp)}
                                </td>
                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                    {tx.txHash ? (
                                        <a
                                            href={`https://amoy.polygonscan.com/tx/${tx.txHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: '#C9A24D',
                                                textDecoration: 'none',
                                                fontSize: '0.95rem',
                                                fontWeight: '600'
                                            }}
                                        >
                                            View
                                        </a>
                                    ) : (
                                        <span style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>Pending</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionHistory;
