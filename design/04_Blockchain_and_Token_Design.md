# 04 Blockchain and Token Design

## Contracts Overview

We will deploy two primary contracts:
1.  **RealEstateNFT.sol** (ERC-721 URIStorage)
2.  **PropertyTokenization.sol** (Main Manager Contract + ERC-1155 or ERC-20 factory logic, simpler: One ERC-20 per property, or a single Vault).

*MVP Decision*: To keep it strictly within the 30-hour limit and "ERC-20 Fractional Share" requirement:
*   **RealEstateNFT**: Represents the asset class itself.
*   **PropertyVault**: A contract that holds the NFT and mints ERC-20 shares against it.

### 1. RealEstateNFT (ERC-721)
*   **Symbol**: `RET` (Real Estate Token)
*   **Functionality**:
    *   `mint(address to, string uri)`: Mints a unique property to an owner.
    *   `tokenURI(uint256 tokenId)`: Returns IPFS metadata link.

### 2. FractionalPropertyFactory
Factory pattern to spawn a new ERC-20 Token contract for each new Property NFT.

*   `createPropertyListing(uint256 _tokenId, string _name, string _symbol, uint256 _totalSupply, uint256 _pricePerShare)`
    *   Transfers NFT from Admin to Contract (Escrow).
    *   Deploys a new `PropertyShareToken` (ERC-20).
    *   Mints `_totalSupply` of shares to the Contract.

### 3. PropertyShareToken (ERC-20)
*   Represents ownership shares.
*   `buyShares(uint256 amount)`: Payable function.
    *   Checks `msg.value == amount * price`.
    *   Transfers Shares from Contract -> Buyer.
    *   Keeps funds in verify-withdraw pattern or sends to Admin.

## On-Chain Flows

### A. Property Onboarding (Admin)
1.  Admin calls `RealEstateNFT.mint(adminAddress, ipfsHash)`.
2.  Admin approves `FractionalPropertyFactory` to spend NFT.
3.  Admin calls `FractionalPropertyFactory.createPropertyListing(...)`.
    *   NFT Locked in contract.
    *   ERC-20 Shares created.

### B. Investment (User)
1.  User calls `PropertyShareToken.buyShares(5)`.
    *   Sends MATIC.
    *   Receives 5 Shares.

### C. Fund Withdrawal (Seller)
1.  Funds accrue in `PropertyShareToken` contract.
2.  Admin (Seller) calls `withdrawFunds()`.

## Security Considerations
*   **Reentrancy Guard**: Use OpenZeppelin `ReentrancyGuard` on `buyShares`.
*   **Access Control**: Only Admin can mint and list.
*   **Pausable**: Ability to pause trading in emergencies.

## Environment Variables (Hardhat)
```bash
POLYGON_MUMBAI_RPC="https://rpc-mumbai.maticvigil.com"
PRIVATE_KEY="0x..." # Admin Wallet
POLYGONSCAN_API_KEY="abc..."
```
