// frontend/src/services/certificate.js
/**
 * Certificate Generation Service
 * Creates PDF ownership certificates for property shares
 */

/**
 * Generate HTML certificate (can be printed as PDF)
 * @param {Object} data - Certificate data
 * @returns {string} HTML content for certificate
 */
export function generateCertificateHTML(data) {
  const {
    certificateId,
    ownerName,
    ownerWallet,
    propertyTitle,
    propertyId,
    shares,
    pricePerShare,
    totalValue,
    purchaseDate,
    txHash,
    contractAddress
  } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Ownership Certificate - ${propertyTitle}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Georgia', serif; 
      background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .certificate {
      background: white;
      width: 800px;
      padding: 50px;
      border: 3px solid #d4af37;
      box-shadow: 0 0 0 10px white, 0 0 0 13px #d4af37;
      position: relative;
    }
    .certificate::before {
      content: '';
      position: absolute;
      top: 20px; left: 20px; right: 20px; bottom: 20px;
      border: 1px solid #e5e7eb;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 2rem;
      font-weight: bold;
      color: #1e3a5f;
      margin-bottom: 5px;
    }
    .title {
      font-size: 2.5rem;
      color: #d4af37;
      text-transform: uppercase;
      letter-spacing: 5px;
      margin: 20px 0;
    }
    .subtitle {
      font-size: 1rem;
      color: #6b7280;
      font-style: italic;
    }
    .content {
      text-align: center;
      margin: 30px 0;
    }
    .owner-name {
      font-size: 1.8rem;
      color: #1e3a5f;
      font-weight: bold;
      border-bottom: 2px solid #d4af37;
      display: inline-block;
      padding-bottom: 5px;
      margin: 20px 0;
    }
    .property-name {
      font-size: 1.4rem;
      color: #374151;
      margin: 15px 0;
    }
    .details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 30px 50px;
      text-align: left;
    }
    .detail-item {
      padding: 10px;
      background: #f9fafb;
      border-radius: 5px;
    }
    .detail-label {
      font-size: 0.8rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .detail-value {
      font-size: 1rem;
      color: #1e3a5f;
      font-weight: 600;
      margin-top: 3px;
    }
    .shares-highlight {
      text-align: center;
      background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
      color: white;
      padding: 20px;
      border-radius: 10px;
      margin: 30px 50px;
    }
    .shares-number {
      font-size: 3rem;
      font-weight: bold;
    }
    .shares-label {
      font-size: 1rem;
      opacity: 0.9;
    }
    .blockchain-proof {
      margin: 30px 50px;
      padding: 15px;
      background: #ecfdf5;
      border-radius: 8px;
      border: 1px solid #10b981;
    }
    .blockchain-title {
      color: #065f46;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .tx-hash {
      font-family: monospace;
      font-size: 0.75rem;
      color: #374151;
      word-break: break-all;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      color: #9ca3af;
      font-size: 0.8rem;
    }
    .qr-placeholder {
      width: 100px;
      height: 100px;
      background: #f3f4f6;
      margin: 20px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-size: 0.7rem;
      color: #6b7280;
    }
    .verify-link {
      color: #2563eb;
      text-decoration: none;
    }
    @media print {
      body { background: white; }
      .certificate { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="logo">AURELIAN</div>
      <div class="title">Certificate of Ownership</div>
      <div class="subtitle">Blockchain-Verified Real Estate Share Certificate</div>
    </div>
    
    <div class="content">
      <p>This is to certify that</p>
      <div class="owner-name">${ownerName}</div>
      <p>is the rightful owner of fractional shares in</p>
      <div class="property-name">${propertyTitle}</div>
    </div>
    
    <div class="shares-highlight">
      <div class="shares-number">${shares}</div>
      <div class="shares-label">Tokenized Shares Owned</div>
    </div>
    
    <div class="details">
      <div class="detail-item">
        <div class="detail-label">Certificate ID</div>
        <div class="detail-value">${certificateId}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Property ID</div>
        <div class="detail-value">${propertyId}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Price Per Share</div>
        <div class="detail-value">${pricePerShare} MATIC</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Total Value</div>
        <div class="detail-value">${totalValue} MATIC</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Purchase Date</div>
        <div class="detail-value">${purchaseDate}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Owner Wallet</div>
        <div class="detail-value" style="font-size: 0.75rem;">${ownerWallet}</div>
      </div>
    </div>
    
    <div class="blockchain-proof">
      <div class="blockchain-title">🔗 Blockchain Verification</div>
      <div class="tx-hash">
        Transaction: ${txHash}
      </div>
      <div style="margin-top: 10px;">
        <a href="https://amoy.polygonscan.com/tx/${txHash}" class="verify-link" target="_blank">
          Verify on PolygonScan →
        </a>
      </div>
    </div>
    
    <div class="qr-placeholder">
      QR Code<br/>
      (Scan to verify)
    </div>
    
    <div class="footer">
      <p>This certificate is secured by blockchain technology on Polygon Amoy Network</p>
      <p>Contract: ${contractAddress}</p>
      <p style="margin-top: 10px;">Generated on ${new Date().toLocaleDateString()}</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Open certificate in new window for printing/saving as PDF
 */
export function openCertificate(data) {
  const html = generateCertificateHTML(data);
  const newWindow = window.open('', '_blank');
  newWindow.document.write(html);
  newWindow.document.close();
}

/**
 * Generate certificate data from purchase
 */
export function createCertificateData(purchase, user, property) {
  return {
    certificateId: `CERT-${Date.now().toString(36).toUpperCase()}`,
    ownerName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
    ownerWallet: purchase.buyerWallet,
    propertyTitle: property.title,
    propertyId: property.id,
    shares: purchase.shares,
    pricePerShare: purchase.pricePerShare,
    totalValue: (purchase.shares * purchase.pricePerShare).toFixed(4),
    purchaseDate: new Date(purchase.timestamp?.toDate?.() || purchase.timestamp).toLocaleDateString(),
    txHash: purchase.txHash,
    contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS
  };
}

export default {
  generateCertificateHTML,
  openCertificate,
  createCertificateData
};
