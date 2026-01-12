// src/pages/Landing.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot, { ChatbotButton } from '../components/Chatbot';

// Process card data with detailed descriptions
const processCards = [
  {
    number: '01',
    title: 'Asset Selection',
    shortDesc: 'Premium properties are vetted, legally structured, and minted as a unique NFT on the Polygon Blockchain.',
    fullDesc: 'Our expert team conducts thorough due diligence on each property, including legal verification, valuation assessment, and market analysis. Only the top 5% of submitted properties make it through our rigorous selection process. Each approved asset is then tokenized as an ERC-721 NFT with all ownership rights encoded on-chain.'
  },
  {
    number: '02',
    title: 'Fractionalization',
    shortDesc: 'The NFT is split into thousands of ERC-1155 tokens. You can buy these shares using MATIC instantly.',
    fullDesc: 'Through smart contract technology, property NFTs are divided into fungible share tokens (ERC-1155). This enables fractional ownership starting from as low as 0.1 MATIC per share. All transactions are transparent, immutable, and executed instantly on the Polygon network with minimal gas fees.'
  },
  {
    number: '03',
    title: 'Ownership & Returns',
    shortDesc: 'Hold tokens in your wallet to prove ownership, trade them on our secondary market, or earn rental yield dividends.',
    fullDesc: 'Token holders receive proportional rental income distributed quarterly directly to their wallets. You can trade your shares 24/7 on our secondary marketplace, or hold long-term to benefit from property appreciation. Digital ownership certificates are available for download and blockchain verification.'
  }
];

const Landing = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0F1115' }}>
      <Navbar />

      {/* Hero Section with Video Background - DARK */}
      <section style={{
        minHeight: '100vh',
        paddingTop: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: '#0F1115'
      }}>
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }}
        >
          <source src="/assets/video.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay - Heavy */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(15,17,21,0.8) 0%, rgba(15,17,21,0.9) 50%, rgba(15,17,21,0.98) 100%)',
          zIndex: 1
        }}></div>

        {/* Centered Content */}
        <div style={{
          textAlign: 'center',
          maxWidth: '1100px',
          padding: '0 40px',
          position: 'relative',
          zIndex: 2
        }}>
          <span style={{
            color: '#C9A24D',
            textTransform: 'uppercase',
            letterSpacing: '0.5em',
            fontSize: '1.3rem',
            fontWeight: '700',
            marginBottom: '32px',
            display: 'block'
          }}>
            The Future of Wealth
          </span>
          <h1 style={{
            marginBottom: '40px',
            fontWeight: '700',
            fontSize: '5rem',
            lineHeight: '1.1',
            color: '#F5F5F5'
          }}>
            Invest in Premium <br />
            <span style={{ color: '#C9A24D' }}>Real Estate on Chain</span>
          </h1>
          <p style={{
            fontSize: '1.5rem',
            color: '#A8A8A8',
            maxWidth: '800px',
            margin: '0 auto 64px',
            lineHeight: '2'
          }}>
            Own fractional shares of high-yield properties securely using Blockchain.
            Start building your portfolio with <strong style={{ color: '#C9A24D' }}>AURELIAN</strong> today.
          </p>
          <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-primary">Start Investing</Link>
            <a href="#process" className="btn-secondary">Learn More</a>
          </div>

          {/* Trust Indicators */}
          <div style={{ marginTop: '140px', display: 'flex', gap: '100px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: '700', color: '#C9A24D' }}>$50M+</div>
              <div style={{ fontSize: '1.1rem', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Assets Tokenized</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: '700', color: '#C9A24D' }}>12,000+</div>
              <div style={{ fontSize: '1.1rem', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Investors</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: '700', color: '#C9A24D' }}>15%</div>
              <div style={{ fontSize: '1.1rem', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Average APY</div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section with Flip Cards */}
      <section id="process" style={{ padding: '180px 0', background: '#0F1115' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '120px' }}>
            <span style={{
              color: '#C9A24D',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              fontSize: '1.2rem',
              fontWeight: '700'
            }}>
              How It Works
            </span>
            <h2 style={{ fontSize: '4rem', marginTop: '24px', fontWeight: '700', color: '#F5F5F5' }}>
              Seamless <span style={{ color: '#C9A24D' }}>Tokenization</span>
            </h2>
          </div>

          <div className="grid-3">
            {processCards.map((card, index) => (
              <div key={index} className="flip-card">
                <div className="flip-card-inner">
                  {/* Front */}
                  <div className="flip-card-front">
                    <div style={{
                      fontSize: '7rem',
                      color: 'rgba(201,162,77,0.1)',
                      fontWeight: '800',
                      position: 'absolute',
                      top: '28px',
                      right: '40px'
                    }}>
                      {card.number}
                    </div>
                    <h3 style={{
                      marginBottom: '32px',
                      fontWeight: '700',
                      fontSize: '2.2rem',
                      color: '#F5F5F5'
                    }}>
                      {card.title}
                    </h3>
                    <p style={{
                      color: '#A8A8A8',
                      fontSize: '1.3rem',
                      lineHeight: '1.9'
                    }}>
                      {card.shortDesc}
                    </p>
                    <div style={{
                      marginTop: '40px',
                      color: '#C9A24D',
                      fontSize: '1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      fontWeight: '700'
                    }}>
                      Hover for details
                    </div>
                  </div>

                  {/* Back */}
                  <div className="flip-card-back">
                    <h3 style={{
                      marginBottom: '28px',
                      fontWeight: '700',
                      fontSize: '2rem',
                      color: '#0F1115'
                    }}>
                      {card.title}
                    </h3>
                    <p style={{
                      color: '#1C1F26',
                      fontSize: '1.2rem',
                      lineHeight: '1.9'
                    }}>
                      {card.fullDesc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="about" style={{ padding: '180px 0', background: '#1C1F26' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '120px', alignItems: 'center' }}>
            <div>
              <img
                src="/assets/team.jpg"
                alt="Aurelian Team"
                style={{
                  width: '100%',
                  borderRadius: '20px',
                  boxShadow: '0 48px 100px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(201,162,77,0.12)'
                }}
              />
            </div>
            <div>
              <span style={{
                color: '#C9A24D',
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                fontSize: '1.2rem',
                fontWeight: '700'
              }}>
                The Minds Behind Aurelian
              </span>
              <h2 style={{ fontSize: '3.5rem', margin: '32px 0', fontWeight: '700', color: '#F5F5F5' }}>
                Visionaries in <span style={{ color: '#C9A24D' }}>Finance</span>
              </h2>
              <p style={{
                color: '#A8A8A8',
                fontSize: '1.4rem',
                marginBottom: '56px',
                lineHeight: '2'
              }}>
                We are a dedicated team of blockchain architects, real estate veterans, and financial strategists building the bridge between traditional assets and the decentralized future.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {['Rian', 'Shaman', 'Salim', 'Dinol'].map(name => (
                  <div key={name} style={{
                    borderLeft: '4px solid #C9A24D',
                    paddingLeft: '28px'
                  }}>
                    <div style={{ fontWeight: '700', color: '#F5F5F5', fontSize: '1.6rem' }}>{name}</div>
                    <div style={{ fontSize: '1.1rem', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Co-Founder</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Chatbot */}
      {chatOpen ? (
        <Chatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      ) : (
        <ChatbotButton onClick={() => setChatOpen(true)} />
      )}
    </div>
  );
};

export default Landing;