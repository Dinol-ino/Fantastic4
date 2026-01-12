// frontend/src/components/SharesDisplay.jsx
import React from 'react';

/**
 * SharesDisplay Component
 * Shows available/sold shares with progress bar
 * Used in marketplace cards and property details
 */
const SharesDisplay = ({
    totalShares,
    soldShares = 0,
    availableShares,
    pricePerShare,
    showValue = false,
    size = 'normal' // 'small', 'normal', 'large'
}) => {
    // Calculate if availableShares not provided
    const available = availableShares ?? (totalShares - soldShares);
    const sold = soldShares || (totalShares - available);
    const soldPercent = Math.round((sold / totalShares) * 100);

    const isLarge = size === 'large';
    const isSmall = size === 'small';

    return (
        <div style={{ marginBottom: isSmall ? '10px' : '15px' }}>
            {/* Progress Bar */}
            <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '10px',
                height: isSmall ? '6px' : isLarge ? '12px' : '8px',
                overflow: 'hidden',
                marginBottom: isSmall ? '5px' : '8px'
            }}>
                <div style={{
                    width: `${soldPercent}%`,
                    height: '100%',
                    backgroundColor: soldPercent >= 100 ? '#ef4444' : soldPercent >= 75 ? '#f59e0b' : '#10b981',
                    borderRadius: '10px',
                    transition: 'width 0.5s ease',
                    boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)'
                }} />
            </div>

            {/* Stats Row */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: isSmall ? '0.75rem' : isLarge ? '1rem' : '0.85rem'
            }}>
                <div>
                    <span style={{
                        fontWeight: '600',
                        color: available > 0 ? '#10b981' : '#ef4444'
                    }}>
                        {available.toLocaleString()}
                    </span>
                    <span style={{ color: '#a1a1aa' }}> / {totalShares.toLocaleString()} available</span>
                </div>

                <div style={{
                    backgroundColor: soldPercent >= 100 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)',
                    color: soldPercent >= 100 ? '#ef4444' : '#d4d4d8',
                    padding: isSmall ? '2px 6px' : '4px 10px',
                    borderRadius: '12px',
                    fontWeight: '500',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    {soldPercent >= 100 ? 'SOLD OUT' : `${soldPercent}% funded`}
                </div>
            </div>

            {/* Optional: Show total value */}
            {showValue && pricePerShare && (
                <div style={{
                    marginTop: '10px',
                    padding: '10px 15px',
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: isSmall ? '0.8rem' : '0.9rem'
                }}>
                    <span style={{ color: '#34d399' }}>Implied Market Value:</span>
                    <span style={{ fontWeight: '600', color: '#10b981' }}>
                        {(pricePerShare * totalShares).toFixed(2)} MATIC
                    </span>
                </div>
            )}
        </div>
    );
};

export default SharesDisplay;
