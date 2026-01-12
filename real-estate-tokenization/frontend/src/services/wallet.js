// src/context/WalletContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [loading, setLoading] = useState(true);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await browserProvider.getSigner();
        const address = await signer.getAddress();
        
        setProvider(browserProvider);
        setSigner(signer);
        setAccount(address);
        
        // Optional: Force switch to Polygon Amoy/Mumbai
        // await switchNetwork(); 
        
      } catch (error) {
        console.error("Connection failed", error);
        alert("Failed to connect wallet.");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
  };

  // Check if wallet is already connected on load
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          connectWallet();
        }
      }
      setLoading(false);
    };
    checkConnection();
  }, []);

  return (
    <WalletContext.Provider value={{ account, provider, signer, connectWallet, disconnectWallet, loading }}>
      {children}
    </WalletContext.Provider>
  );
};