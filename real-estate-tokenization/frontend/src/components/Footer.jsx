// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: '#0F1115',
            borderTop: '1px solid rgba(201,162,77,0.12)',
            padding: '120px 0 60px',
            marginTop: 'auto',
            fontFamily: 'Times New Roman, serif'
        }}>
            <div className="container">
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '80px', marginBottom: '100px' }}>

                    {/* Brand */}
                    <div style={{ maxWidth: '380px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            marginBottom: '28px',
                            color: '#C9A24D',
                            fontSize: '2rem',
                            fontWeight: '700',
                            letterSpacing: '0.18em'
                        }}>
                            <img src="/assets/logo.jpg" alt="Logo" style={{ height: '48px' }} />
                            AURELIAN
                        </div>
                        <p style={{ color: '#A8A8A8', fontSize: '1.15rem', lineHeight: '1.9' }}>
                            The world's premier destination for on-chain real estate investment.
                            Secure, transparent, and liquid property ownership powering the future of wealth.
                        </p>
                    </div>

                    {/* Links */}
                    <div style={{ display: 'flex', gap: '100px', flexWrap: 'wrap' }}>
                        <div>
                            <h4 style={{
                                color: '#C9A24D',
                                marginBottom: '28px',
                                fontSize: '1.1rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.18em',
                                fontWeight: '700'
                            }}>Platform</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                <Link to="/marketplace" style={{ color: '#A8A8A8', textDecoration: 'none', fontSize: '1.1rem' }}>Marketplace</Link>
                                <Link to="/resale" style={{ color: '#A8A8A8', textDecoration: 'none', fontSize: '1.1rem' }}>Secondary Market</Link>
                                <Link to="/register" style={{ color: '#A8A8A8', textDecoration: 'none', fontSize: '1.1rem' }}>Start Investing</Link>
                            </div>
                        </div>
                        <div>
                            <h4 style={{
                                color: '#C9A24D',
                                marginBottom: '28px',
                                fontSize: '1.1rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.18em',
                                fontWeight: '700'
                            }}>Company</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                <a href="#about" style={{ color: '#A8A8A8', textDecoration: 'none', fontSize: '1.1rem' }}>About Us</a>
                                <a href="#process" style={{ color: '#A8A8A8', textDecoration: 'none', fontSize: '1.1rem' }}>How it Works</a>
                                <a href="#" style={{ color: '#A8A8A8', textDecoration: 'none', fontSize: '1.1rem' }}>Contact</a>
                            </div>
                        </div>
                    </div>

                    {/* Socials */}
                    <div>
                        <h4 style={{
                            color: '#C9A24D',
                            marginBottom: '28px',
                            fontSize: '1.1rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.18em',
                            fontWeight: '700'
                        }}>Connect</h4>
                        <div style={{ display: 'flex', gap: '18px' }}>
                            {/* Instagram */}
                            <a href="#" className="social-icon" aria-label="Instagram">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </a>
                            {/* X / Twitter */}
                            <a href="#" className="social-icon" aria-label="X (Twitter)">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                            </a>
                            {/* Gmail */}
                            <a href="mailto:contact@aurelian.com" className="social-icon" aria-label="Email">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            </a>
                            {/* Reddit */}
                            <a href="#" className="social-icon" aria-label="Reddit">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M17 13c-1.5 0-3-1.5-3-3 0 1.5-1.5 3-3 3-1.5 0-3-1.5-3-3 0 1.5-1.5 3-3 3"></path><path d="M7 17s2 2 5 2 5-2 5-2"></path></svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid rgba(201,162,77,0.08)',
                    paddingTop: '48px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '24px',
                    color: '#6B6B6B',
                    fontSize: '1rem'
                }}>
                    <div>2024 AURELIAN. All rights reserved.</div>
                    <div style={{ display: 'flex', gap: '36px' }}>
                        <a href="#" style={{ color: '#6B6B6B', textDecoration: 'none' }}>Privacy Policy</a>
                        <a href="#" style={{ color: '#6B6B6B', textDecoration: 'none' }}>Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
