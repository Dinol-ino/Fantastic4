# 07 Frontend Pages and Flows

## Tech Stack
*   **React** (Vite)
*   **Tailwind CSS** (Styling)
*   **Ethers.js** (Blockchain Interaction)
*   **React Router** (Navigation)
*   **Axios** (API Calls)

## Page Structure

### 1. Public Pages
*   **Landing Page (`/`)**:
    *   Hero section ("Invest in Real Estate").
    *   "Connect Wallet" button (Global Header).
    *   Login / Register links.
*   **Marketplace (`/marketplace`)**:
    *   Grid of `PropertyCard` components.
    *   Filter by Price, Location.
*   **Login / Register (`/login`, `/register`)**:
    *   Firebase forms.

### 2. User/Investor Pages (Protected)
*   **Property Details (`/property/:id`)**:
    *   Image Gallery (from IPFS/Firestore).
    *   "Buy Shares" Widget (Input MATIC amount -> Calls Smart Contract).
    *   Progress Bar (Funds Raised vs Total).
    *   *Data Source*: Firestore for metadata, Blockchain for live shares available.
*   **Dashboard / Portfolio (`/dashboard`)**:
    *   List of My Investments.
    *   Total Value (Calculated via Mock Oracle Price).
    *   Link to view "Certificate" (Etherscan/PolygonScan or internal view).

### 3. Admin Pages (Protected: Role=Admin)
*   **Admin Console (`/admin`)**:
    *   "Create New Property" Button.
    *   List of existing properties and their status (Accrued funds).
*   **Create Property (`/admin/create`)**:
    *   Form: Title, Description, Location, Total Value.
    *   Uploads: Images (Multiple), Documents (PDFs).
    *   Submit Action:
        1.  Uploads files to Backend -> Pinata.
        2.  Receives IPFS Hash.
        3.  Trigger MetaMask to Mint NFT & Create Shares.

## Key UI Components
*   **Navbar**: Wallet Address (truncated), Balance (MATIC), Navigation Links.
*   **PropertyCard**: Image, Title, Price/Share, % Funded.
*   **PurchaseModal**: Input field for MATIC, estimates shares received. "Confirm Transaction" button.
*   **Toaster**: Success/Error notifications for Blockchain transactions.

## Design System (Tailwind)
*   **Primary Color**: `blue-600` (Trust/Corporate).
*   **Accent**: `emerald-500` (Money/Success).
*   **Fonts**: Inter or Roboto (Clean sans-serif).
