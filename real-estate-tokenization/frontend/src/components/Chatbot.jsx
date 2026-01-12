// frontend/src/components/Chatbot.jsx
/**
 * AURELIAN AI Chatbot Component using OpenRouter
 * Real Estate & Blockchain guidance assistant
 */
import React, { useState, useRef, useEffect } from 'react';

// OpenRouter API
const OPENROUTER_API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM_PROMPT = `You are a helpful assistant for AURELIAN, a premium real estate tokenization platform built on Polygon blockchain. You specialize in:

1. **Real Estate Investment**: Property types, investment strategies, ROI calculations, market trends in India
2. **Blockchain Technology**: How blockchain works, smart contracts, benefits of tokenization
3. **Platform Guidance**: How to buy/sell property shares, understanding MATIC, MetaMask wallet setup

Key points to explain to users:
- **Why Blockchain for Real Estate**: Transparency (all transactions on-chain), security (immutable records), 24/7 trading, fractional ownership enables small investments, no intermediaries reduce costs
- **Benefits**: Lower entry barrier (invest from 500 INR), liquidity (sell anytime), global access, reduced fraud through smart contracts
- **Risks**: Market volatility, regulatory uncertainty, technology risks, smart contract bugs
- **MATIC**: Native token of Polygon network, used for gas fees and payments, very low transaction costs

Keep responses concise (2-3 paragraphs max), friendly, and helpful. Use bullet points for complex topics. If asked about specific prices or predictions, remind users this is not financial advice.`;

const Chatbot = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Welcome to AURELIAN.\n\nI can assist you with:\n- Real estate tokenization\n- Blockchain & MATIC basics\n- Buying and selling property shares\n- Investment risks and benefits\n\nHow may I help you today?'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'AURELIAN Real Estate Platform'
                },
                body: JSON.stringify({
                    model: 'mistralai/mistral-7b-instruct:free',
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        ...messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0).map(m => ({
                            role: m.role,
                            content: m.content
                        })),
                        { role: 'user', content: userMessage }
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content || 'I apologize, I could not process that. Please try again.';

            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch (error) {
            console.error('Chatbot error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'I apologize, I am having trouble connecting. Please try again in a moment.\n\nIn the meantime, you can:\n- Browse our marketplace at /marketplace\n- Check the home page for more information'
            }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '400px',
            height: '550px',
            backgroundColor: '#0F1115',
            borderRadius: '16px',
            boxShadow: '0 10px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.2)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
            fontFamily: 'Times New Roman, serif'
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #d4af37 0%, #8b6914 100%)',
                color: '#000',
                padding: '18px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <div style={{ fontWeight: '700', fontSize: '1.2rem', letterSpacing: '0.1em' }}>AURELIAN AI</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Real Estate & Blockchain Guide</div>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'rgba(0,0,0,0.2)',
                        border: 'none',
                        color: '#000',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '1.4rem',
                        fontWeight: '700'
                    }}
                >
                    x
                </button>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                backgroundColor: '#0a0a0a'
            }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        marginBottom: '16px',
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                    }}>
                        <div style={{
                            maxWidth: '85%',
                            padding: '14px 18px',
                            borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            backgroundColor: msg.role === 'user' ? '#C9A24D' : '#1C1F26',
                            color: msg.role === 'user' ? '#0F1115' : '#F5F5F5',
                            border: msg.role === 'user' ? 'none' : '1px solid rgba(201,162,77,0.15)',
                            whiteSpace: 'pre-wrap',
                            fontSize: '1rem',
                            lineHeight: '1.6'
                        }}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                        <div style={{
                            padding: '14px 18px',
                            borderRadius: '16px',
                            backgroundColor: '#1a1a1a',
                            color: '#d4af37',
                            border: '1px solid rgba(212,175,55,0.2)'
                        }}>
                            <span>Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} style={{
                padding: '16px 20px',
                borderTop: '1px solid rgba(212,175,55,0.15)',
                backgroundColor: '#0F1115',
                display: 'flex',
                gap: '12px'
            }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about real estate, blockchain..."
                    disabled={loading}
                    style={{
                        flex: 1,
                        padding: '14px 18px',
                        borderRadius: '8px',
                        border: '1px solid rgba(212,175,55,0.2)',
                        backgroundColor: '#111',
                        color: '#fff',
                        outline: 'none',
                        fontSize: '1rem',
                        fontFamily: 'Times New Roman, serif'
                    }}
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    style={{
                        background: 'linear-gradient(135deg, #d4af37 0%, #8b6914 100%)',
                        color: '#000',
                        border: 'none',
                        borderRadius: '8px',
                        width: '50px',
                        height: '50px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: loading || !input.trim() ? 0.5 : 1,
                        fontSize: '1.2rem',
                        fontWeight: '700'
                    }}
                >
                    &gt;
                </button>
            </form>

            {/* Quick Questions */}
            <div style={{
                padding: '12px 20px',
                backgroundColor: '#050505',
                display: 'flex',
                gap: '10px',
                overflowX: 'auto',
                borderTop: '1px solid rgba(212,175,55,0.1)'
            }}>
                {['Why blockchain?', 'How to buy shares?', 'What is MATIC?'].map(q => (
                    <button
                        key={q}
                        onClick={() => { setInput(q); }}
                        style={{
                            padding: '8px 14px',
                            borderRadius: '6px',
                            border: '1px solid rgba(212,175,55,0.3)',
                            backgroundColor: 'transparent',
                            color: '#d4af37',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            fontFamily: 'Times New Roman, serif'
                        }}
                    >
                        {q}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Floating button to open chatbot
export const ChatbotButton = ({ onClick }) => (
    <button
        onClick={onClick}
        style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #DDB85D 0%, #C9A24D 50%, #9A7A3A 100%)',
            color: '#0F1115',
            border: 'none',
            boxShadow: '0 6px 24px rgba(212, 175, 55, 0.4)',
            cursor: 'pointer',
            fontSize: '1.5rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(212, 175, 55, 0.6)';
        }}
        onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(212, 175, 55, 0.4)';
        }}
    >
        ?
    </button>
);

export default Chatbot;
