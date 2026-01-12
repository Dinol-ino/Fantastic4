# 08 Execution Plan and Roles

## 30-Hour Hackathon Schedule

### Phase 1: Setup & Boilerplate (Hours 0-4)
*   **Backend**: Init Node/Express, connect Firestore, setup Firebase Admin.
*   **Frontend**: Init Vite/React, install Tailwind, setup Routes.
*   **Blockchain**: Init Hardhat, configure Mumbai Testnet.

### Phase 2: Core Infrastructure (Hours 4-10)
*   **Blockchain**: Write `RealEstateNFT.sol` and `PropertyVault.sol`.
*   **Storage**: Setup Pinata API in Backend.
*   **Auth**: Implement Firebase Login + Wallet Connect loop.

### Phase 3: Property Onboarding (Hours 10-18)
*   **Smart Contracts**: Deploy to Mumbai.
*   **Backend**: Endpoint for creating properties + IPFS upload.
*   **Frontend**: Admin Dashboard + Create Form.
*   **Integration**: Connect "Mint" button to Contract.

### Phase 4: Investment Flow (Hours 18-24)
*   **Smart Contracts**: Finalize `buyShares` logic.
*   **Frontend**: Marketplace Grid + Property Details Page.
*   **Backend**: Implement Event Listener (`listener.js`) to sync buys to Firestore.

### Phase 5: Polish & Notifications (Hours 24-28)
*   **Email**: Setup Nodemailer for investment confirmation.
*   **UI/UX**: Loading states, error handling, aesthetic polish.
*   **Dashboard**: Investor view of owned shares.

### Phase 6: Testing & Demo Prep (Hours 28-30)
*   **Dry Run**: Full flow from Admin create -> User buy -> Email received.
*   **Video**: Record demo walkthrough.
*   **Readme**: Write instructions.

## Roles & Responsibilities

### Role A: Full Stack / Blockchain (Lead)
*   **Focus**: Smart Contracts, Web3 Integration (Ethers.js), Backend Event Listener.
*   **Key Deliverables**: `RealEstateNFT.sol`, `listener.js`, Frontend "Buy" Widget.

### Role B: Frontend / Design
*   **Focus**: React UI, Firebase Auth, API Integration.
*   **Key Deliverables**: Landing Page, Dashboard, Admin Forms, Context/State Management.

### Role C: Backend / Data (if Team of 3)
*   **Focus**: API Endpoints, Firestore Schema, IPFS/Pinata Handler, Email Service.

*(For a duo, Roles B & C split the Backend work).*
