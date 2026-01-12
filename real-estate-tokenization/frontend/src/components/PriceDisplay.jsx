// frontend/src/components/PriceDisplay.jsx
/**
 * Price Display Component
 * Shows MATIC price with INR conversion
 */
import React, { useState, useEffect } from 'react';
import { getMaticToInrRate, maticToInr } from '../services/currency';

const PriceDisplay = ({
    amount,
    size = 'normal', // 'small', 'normal', 'large'
    showLabel = false,
    label = 'Price'
}) => {
    const [rate, setRate] = useState(70);

    useEffect(() => {
        getMaticToInrRate().then(setRate);
    }, []);

    const inrValue = maticToInr(amount, rate);

    const fontSize = size === 'small' ? '0.85rem' : size === 'large' ? '1.3rem' : '1rem';
    const inrFontSize = size === 'small' ? '0.75rem' : size === 'large' ? '0.95rem' : '0.85rem';

    return (
        <div>
            {showLabel && (
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '2px' }}>
                    {label}
                </div>
            )}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{
                    fontSize,
                    fontWeight: '600',
                    color: '#2563eb'
                }}>
                    {typeof amount === 'number' ? amount.toFixed(4) : amount} MATIC
                </span>
                <span style={{
                    fontSize: inrFontSize,
                    color: '#6b7280',
                    backgroundColor: '#f3f4f6',
                    padding: '2px 6px',
                    borderRadius: '4px'
                }}>
                    ≈ {inrValue}
                </span>
            </div>
        </div>
    );
};

export default PriceDisplay;
