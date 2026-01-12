# 01 System Overview

## Purpose
The Real Estate Tokenization Platform (MVP) is a decentralized application (dApp) designed to allow property owners (Admins) to tokenize real estate assets into fractionalized NFTs (ERC-721 + ERC-20) and allow investors to purchase these shares using MATIC on the Polygon Mumbai Testnet.

## Goal
To demonstrate a functional, end-to-end flow of real estate tokenization, from property onboarding to fractional investment, within a 30-hour hackathon timeframe.

## Scope (MVP)

### Core Features
1.  **User Roles**:
    *   **Admin**: Property onboarding, NFT minting, document upload.
    *   **Investor**: Browse properties, purchase fractional shares, view portfolio.
2.  **Asset Tokenization**:
    *   Each property is represented by a unique **ERC-721 NFT**.
    *   Ownership is fractionalized into **ERC-20 tokens** pegged to the NFT.
3.  **Investment Logic**:
    *   Users buy shares with **MATIC**.
    *   Smart contracts handle escrow and fund distribution to the seller.
4.  **Data Management**:
    *   Off-chain details (high-res images, sensitive docs) on **IPFS** (public/private).
    *   User profiles, transaction logs, and rapid-access data on **Firestore**.
    *   Authentication via **Firebase Auth**.
5.  **Notifications**:
    *   Email alerts for registration and successful investments via **Gmail SMTP**.

## MVP Limitations
*   **KYC/AML**: Skipped for hackathon speed; basic email/wallet auth is sufficient.
*   **Legal Framework**: Mock legal validity; focus is on technical implementation.
*   **Secondary Market**: Out of scope for MVP (Primary sales only).
*   **Currency**: Strictly **MATIC** (Testnet).

## User Journey
1.  **Registration**: User signs up with email (Firebase) and connects MetaMask wallet.
2.  **Onboarding (Admin)**: Admin uploads property details + docs. System uploads to IPFS, mints NFT, and creates fractional shares.
3.  **Discovery (Investor)**: Investor browses available properties (data synced from Chain/Firestore).
4.  **Investment**: Investor pays MATIC. Smart contract transfers shares to Investor and custom logic releases funds to Admin.
5.  **Confirmation**: Investor receives email + on-chain certificate. Dashboard updates.
