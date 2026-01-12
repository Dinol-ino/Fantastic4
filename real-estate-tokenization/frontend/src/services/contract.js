// frontend/src/services/contract.js
/**
 * Smart Contract Service
 * Interacts with RealEstateMarketplace contract on Polygon Amoy
 */
import { ethers } from 'ethers';

// Contract address from deployment
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// Optimized contract ABI (matches RealEstateNFT.sol)
export const CONTRACT_ABI = [
    // List property (admin)
    {
        inputs: [
            { name: "_price", type: "uint256" },
            { name: "_shares", type: "uint256" }
        ],
        name: "listProperty",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    // Buy shares (primary)
    {
        inputs: [
            { name: "_id", type: "uint256" },
            { name: "_amount", type: "uint256" }
        ],
        name: "buyShares",
        outputs: [],
        stateMutability: "payable",
        type: "function"
    },
    // List for resale
    {
        inputs: [
            { name: "_propId", type: "uint256" },
            { name: "_shares", type: "uint256" },
            { name: "_price", type: "uint256" }
        ],
        name: "listForResale",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    // Buy from resale
    {
        inputs: [
            { name: "_listingId", type: "uint256" },
            { name: "_amount", type: "uint256" }
        ],
        name: "buyResale",
        outputs: [],
        stateMutability: "payable",
        type: "function"
    },
    // Cancel resale
    {
        inputs: [{ name: "_id", type: "uint256" }],
        name: "cancelResale",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    // Get price (view)
    {
        inputs: [{ name: "_id", type: "uint256" }],
        name: "getPrice",
        outputs: [{ type: "uint256" }],
        stateMutability: "view",
        type: "function"
    },
    // Get market value (view)
    {
        inputs: [{ name: "_id", type: "uint256" }],
        name: "getMarketValue",
        outputs: [{ type: "uint256" }],
        stateMutability: "view",
        type: "function"
    },
    // Properties mapping
    {
        inputs: [{ name: "", type: "uint256" }],
        name: "properties",
        outputs: [
            { name: "pricePerShare", type: "uint256" },
            { name: "totalShares", type: "uint256" },
            { name: "sharesSold", type: "uint256" },
            { name: "owner", type: "address" },
            { name: "isActive", type: "bool" }
        ],
        stateMutability: "view",
        type: "function"
    },
    // User shares
    {
        inputs: [
            { name: "", type: "uint256" },
            { name: "", type: "address" }
        ],
        name: "userShares",
        outputs: [{ type: "uint256" }],
        stateMutability: "view",
        type: "function"
    },
    // Resale listings
    {
        inputs: [{ name: "", type: "uint256" }],
        name: "resaleListings",
        outputs: [
            { name: "propertyId", type: "uint256" },
            { name: "seller", type: "address" },
            { name: "shares", type: "uint256" },
            { name: "price", type: "uint256" },
            { name: "isActive", type: "bool" }
        ],
        stateMutability: "view",
        type: "function"
    },
    // Last resale price
    {
        inputs: [{ name: "", type: "uint256" }],
        name: "lastResalePrice",
        outputs: [{ type: "uint256" }],
        stateMutability: "view",
        type: "function"
    },
    // Next IDs
    { inputs: [], name: "nextPropertyId", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
    { inputs: [], name: "nextListingId", outputs: [{ type: "uint256" }], stateMutability: "view", type: "function" },
    // Events
    { anonymous: false, inputs: [{ indexed: true, name: "id", type: "uint256" }, { indexed: false, name: "owner", type: "address" }, { indexed: false, name: "price", type: "uint256" }, { indexed: false, name: "shares", type: "uint256" }], name: "PropertyListed", type: "event" },
    { anonymous: false, inputs: [{ indexed: true, name: "id", type: "uint256" }, { indexed: false, name: "buyer", type: "address" }, { indexed: false, name: "shares", type: "uint256" }, { indexed: false, name: "cost", type: "uint256" }], name: "SharesPurchased", type: "event" },
    { anonymous: false, inputs: [{ indexed: true, name: "listingId", type: "uint256" }, { indexed: false, name: "propertyId", type: "uint256" }, { indexed: false, name: "shares", type: "uint256" }, { indexed: false, name: "price", type: "uint256" }], name: "ResaleCreated", type: "event" },
    { anonymous: false, inputs: [{ indexed: true, name: "listingId", type: "uint256" }, { indexed: false, name: "buyer", type: "address" }, { indexed: false, name: "shares", type: "uint256" }, { indexed: false, name: "newPrice", type: "uint256" }], name: "ResaleSold", type: "event" }
];

// Polygon Amoy config
export const AMOY_CONFIG = {
    chainId: '0x13882', // 80002
    chainName: 'Polygon Amoy Testnet',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://rpc-amoy.polygon.technology'],
    blockExplorerUrls: ['https://amoy.polygonscan.com/']
};

/**
 * Get contract instance
 */
export function getContract(signerOrProvider) {
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS.includes('YourDeployed')) {
        console.warn('Contract address not configured');
        return null;
    }
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
}

/**
 * Buy shares from primary listing
 */
export async function buySharesPrimary(signer, propertyBlockchainId, shares, pricePerShareMatic) {
    const contract = getContract(signer);
    if (!contract) throw new Error('Contract not configured');

    const totalCost = ethers.parseEther((shares * pricePerShareMatic).toString());

    const tx = await contract.buyShares(propertyBlockchainId, shares, { value: totalCost });
    const receipt = await tx.wait();

    return {
        success: true,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber
    };
}

/**
 * List shares for resale
 */
export async function listForResale(signer, propertyId, shares, pricePerShareMatic) {
    const contract = getContract(signer);
    if (!contract) throw new Error('Contract not configured');

    const priceWei = ethers.parseEther(pricePerShareMatic.toString());
    const tx = await contract.listForResale(propertyId, shares, priceWei);
    const receipt = await tx.wait();

    return { success: true, txHash: receipt.hash };
}

/**
 * Buy from resale listing
 */
export async function buyFromResale(signer, listingId, shares, pricePerShareMatic) {
    const contract = getContract(signer);
    if (!contract) throw new Error('Contract not configured');

    const totalCost = ethers.parseEther((shares * pricePerShareMatic).toString());
    const tx = await contract.buyResale(listingId, shares, { value: totalCost });
    const receipt = await tx.wait();

    return { success: true, txHash: receipt.hash };
}

/**
 * Get property info from blockchain
 */
export async function getPropertyFromChain(provider, propertyId) {
    const contract = getContract(provider);
    if (!contract) return null;

    const [pricePerShare, totalShares, sharesSold, owner, isActive] = await contract.properties(propertyId);
    const currentPrice = await contract.getPrice(propertyId);

    return {
        pricePerShare: ethers.formatEther(pricePerShare),
        currentPrice: ethers.formatEther(currentPrice),
        totalShares: Number(totalShares),
        sharesSold: Number(sharesSold),
        availableShares: Number(totalShares) - Number(sharesSold),
        owner,
        isActive
    };
}

/**
 * Get user's shares for a property
 */
export async function getUserSharesFromChain(provider, propertyId, userAddress) {
    const contract = getContract(provider);
    if (!contract) return 0;

    const shares = await contract.userShares(propertyId, userAddress);
    return Number(shares);
}

/**
 * Switch network to Amoy
 */
export async function switchToAmoy() {
    if (!window.ethereum) throw new Error('No wallet');

    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: AMOY_CONFIG.chainId }]
        });
    } catch (e) {
        if (e.code === 4902) {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [AMOY_CONFIG]
            });
        } else throw e;
    }
}

export default {
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    AMOY_CONFIG,
    getContract,
    buySharesPrimary,
    listForResale,
    buyFromResale,
    getPropertyFromChain,
    getUserSharesFromChain,
    switchToAmoy
};
