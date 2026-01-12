// frontend/src/pages/Admin/CreateProperty.jsx
import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext'; // Use the hook we made
import { ethers } from 'ethers';
import axios from 'axios';
import { db } from '../../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

// 🔴 REPLACE WITH YOUR DEPLOYED CONTRACT ADDRESS
const CONTRACT_ADDRESS = "0xYourDeployedContractAddressHere"; 
import RealEstateABI from '../../assets/RealEstate.json'; // We need the ABI json

const CreateProperty = () => {
  const { signer } = useWallet();
  const [form, setForm] = useState({
    title: '',
    location: '',
    pricePerShare: '',
    totalShares: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleUploadAndMint = async (e) => {
    e.preventDefault();
    if (!signer) return alert("Please connect wallet first!");

    setLoading(true);
    setStatus("Uploading Image to IPFS...");

    try {
      // 1. Upload Image to Backend (Pinata)
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await axios.post('http://localhost:5000/api/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const ipfsUrl = uploadRes.data.url; // The link to the image
      setStatus("Image Uploaded! Minting NFT...");

      // 2. Call Blockchain Contract
      const contract = new ethers.Contract(CONTRACT_ADDRESS, RealEstateABI.abi, signer);
      
      // Convert Price to Wei (1 MATIC = 10^18 Wei)
      const priceInWei = ethers.parseEther(form.pricePerShare);
      
      const tx = await contract.listProperty(
        priceInWei,
        form.totalShares,
        ipfsUrl // We use the Image URL as the TokenURI for simplicity in Hackathon
      );

      setStatus("Waiting for transaction confirmation...");
      await tx.wait(); // Wait for block confirmation

      // 3. Save to Firestore (Sync)
      setStatus("Saving to Database...");
      // We use a random ID or fetch from events (For MVP, random ID is fine)
      const propertyId = Date.now().toString(); 
      
      await setDoc(doc(db, "properties", propertyId), {
        title: form.title,
        location: form.location,
        pricePerShare: form.pricePerShare,
        totalShares: form.totalShares,
        imageUrl: ipfsUrl,
        owner: await signer.getAddress(),
        createdAt: new Date()
      });

      setStatus("Property Listed Successfully!");
      setForm({ title: '', location: '', pricePerShare: '', totalShares: '' });

    } catch (error) {
      console.error(error);
      setStatus("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '100px' }}>
      <div className="auth-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 className="text-center">List New Property</h2>
        
        {status && <div className="alert">{status}</div>}

        <form onSubmit={handleUploadAndMint}>
          <div className="form-group">
            <label>Property Title</label>
            <input className="form-input" onChange={e => setForm({...form, title: e.target.value})} />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input className="form-input" onChange={e => setForm({...form, location: e.target.value})} />
          </div>

          <div className="flex gap-20">
            <div className="form-group">
              <label>Price Per Share (MATIC)</label>
              <input className="form-input" type="number" step="0.001" onChange={e => setForm({...form, pricePerShare: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Total Shares</label>
              <input className="form-input" type="number" onChange={e => setForm({...form, totalShares: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label>Property Image</label>
            <input type="file" onChange={e => setFile(e.target.files[0])} />
          </div>

          <button disabled={loading} className="btn-primary btn-full">
            {loading ? 'Processing...' : 'Mint & List Property'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProperty;