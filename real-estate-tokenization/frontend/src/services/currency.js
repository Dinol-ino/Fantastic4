// frontend/src/services/currency.js
/**
 * Currency Conversion Service
 * Converts MATIC to INR with live rate fetching
 */

// Fallback rate: 1 MATIC ≈ ₹70 (approximate)
const FALLBACK_MATIC_INR = 70;

let cachedRate = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get MATIC to INR rate
 * Uses CoinGecko API with fallback
 */
export async function getMaticToInrRate() {
    // Return cached rate if fresh
    if (cachedRate && Date.now() - cacheTime < CACHE_DURATION) {
        return cachedRate;
    }

    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=inr'
        );
        const data = await response.json();
        cachedRate = data['matic-network']?.inr || FALLBACK_MATIC_INR;
        cacheTime = Date.now();
        return cachedRate;
    } catch (error) {
        console.log('Using fallback MATIC rate');
        return FALLBACK_MATIC_INR;
    }
}

/**
 * Convert MATIC to INR
 */
export function maticToInr(maticAmount, rate = FALLBACK_MATIC_INR) {
    const inr = maticAmount * rate;
    return formatInr(inr);
}

/**
 * Format number as INR currency
 */
export function formatInr(amount) {
    if (amount >= 10000000) {
        return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(2)} L`;
    } else if (amount >= 1000) {
        return `₹${(amount / 1000).toFixed(2)}K`;
    }
    return `₹${amount.toFixed(2)}`;
}

/**
 * Hook-friendly converter
 */
export function useMaticToInr() {
    return { convert: maticToInr, rate: cachedRate || FALLBACK_MATIC_INR };
}

export default {
    getMaticToInrRate,
    maticToInr,
    formatInr
};
