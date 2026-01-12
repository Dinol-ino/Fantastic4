// frontend/src/pages/Marketplace.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import Navbar from '../components/Navbar';
import SharesDisplay from '../components/SharesDisplay';
import { useWallet } from '../context/WalletContext';
import { maticToInr, getMaticToInrRate } from '../services/currency';

// Demo properties for when Firestore is empty or fails
const getDemoProperties = () => [
  {
    id: 'demo1',
    title: 'Luxury Sea View Villa',
    location: { address: 'Goa, India' },
    propertyType: 'residential',
    pricePerShare: 0.5,
    currentPrice: 0.55,
    initialPrice: 0.5,
    totalShares: 1000,
    availableShares: 750,
    mainImageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    isVerified: true
  },
  {
    id: 'demo2',
    title: 'Downtown Commercial Complex',
    location: { address: 'Mumbai, Maharashtra' },
    propertyType: 'commercial',
    pricePerShare: 1.0,
    currentPrice: 1.2,
    initialPrice: 1.0,
    totalShares: 500,
    availableShares: 200,
    mainImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    isVerified: true
  },
  {
    id: 'demo3',
    title: 'Agricultural Land Plot',
    location: { address: 'Punjab, India' },
    propertyType: 'land',
    pricePerShare: 0.2,
    currentPrice: 0.2,
    initialPrice: 0.2,
    totalShares: 2000,
    availableShares: 2000,
    mainImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    isVerified: true
  }
];

const Marketplace = () => {
  const { provider, isConnected } = useWallet();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, available, soldout
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Fetch from Firestore (simple query - no index needed)
        let props = [];

        try {
          // Try simple query without orderBy
          const propsQuery = query(
            collection(db, 'properties'),
            where('isVerified', '==', true)
          );
          const snapshot = await getDocs(propsQuery);
          props = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e) {
          // Fallback: get all and filter
          const allSnap = await getDocs(collection(db, 'properties'));
          props = allSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(p => p.isVerified !== false);
        }

        // Sort by createdAt in JavaScript
        props.sort((a, b) => {
          const timeA = a.createdAt?.toDate?.()?.getTime() || 0;
          const timeB = b.createdAt?.toDate?.()?.getTime() || 0;
          return timeB - timeA;
        });

        setProperties(props.length > 0 ? props : getDemoProperties());
      } catch (error) {
        console.error('Error fetching properties:', error);
        // Use demo data on error
        setProperties(getDemoProperties());
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties
  const filteredProperties = properties.filter(prop => {
    // Search filter
    if (search && !prop.title?.toLowerCase().includes(search.toLowerCase()) &&
      !prop.location?.address?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    // Availability filter
    if (filter === 'available' && prop.availableShares <= 0) return false;
    if (filter === 'soldout' && prop.availableShares > 0) return false;

    return true;
  });

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <Navbar />

      <main className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        {/* Header */}
        <div style={{ marginBottom: '50px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '16px', color: '#d4af37' }}>
            Property Marketplace
          </h1>
          <p style={{ color: '#888', fontSize: '1.2rem' }}>
            Browse tokenized real estate and invest in fractional ownership
          </p>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '40px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ maxWidth: '350px' }}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            {['all', 'available', 'soldout'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '6px',
                  border: filter === f ? 'none' : '1px solid rgba(212,175,55,0.3)',
                  background: filter === f ? 'linear-gradient(135deg, #d4af37 0%, #8b6914 100%)' : 'transparent',
                  color: filter === f ? '#000' : '#d4af37',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '1rem',
                  fontFamily: 'Times New Roman, serif'
                }}
              >
                {f === 'all' ? 'All' : f === 'available' ? 'Available' : 'Sold Out'}
              </button>
            ))}
          </div>

          <span style={{ color: '#666', marginLeft: 'auto', fontSize: '1rem' }}>
            {filteredProperties.length} properties found
          </span>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
            Loading properties...
          </div>
        ) : filteredProperties.length === 0 ? (
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '80px 24px',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#1f2937'
          }}>  <h3>No properties found</h3>
            <p style={{ color: '#6b7280', marginTop: '10px' }}>
              Try adjusting your filters or check back later
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '25px'
          }}>
            {filteredProperties.map(property => {
              const priceChange = property.initialPrice && property.currentPrice
                ? ((property.currentPrice - property.initialPrice) / property.initialPrice * 100).toFixed(1)
                : 0;

              return (
                <Link
                  to={`/property/${property.id}`}
                  key={property.id}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="card" style={{
                    padding: 0,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    height: '100%',
                    background: '#121214',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.borderColor = '#d4af37';
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Image */}
                    <div style={{ position: 'relative' }}>
                      <img
                        src={property.mainImageUrl || property.images?.[0]?.url || '/assets/placeholder.jpg'}
                        alt={property.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          backgroundColor: '#1C1F26'
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop';
                        }}
                      />

                      {/* Badges */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        display: 'flex',
                        gap: '8px'
                      }}>
                        <span style={{
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          backdropFilter: 'blur(4px)',
                          color: 'white',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                          {property.propertyType?.toUpperCase()}
                        </span>

                        {property.availableShares <= 0 && (
                          <span style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            SOLD OUT
                          </span>
                        )}
                      </div>

                      {/* Price change badge */}
                      {priceChange !== 0 && (
                        <span style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          backgroundColor: priceChange > 0 ? '#10b981' : '#ef4444',
                          color: 'white',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {priceChange > 0 ? '↑' : '↓'} {Math.abs(priceChange)}%
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: '24px' }}>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: 'white',
                        lineHeight: 1.3
                      }}>
                        {property.title}
                      </h3>

                      <p style={{
                        color: '#a1a1aa',
                        fontSize: '0.9rem',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span style={{ color: '#d4af37' }}>📍</span>
                        {property.location?.address?.split(',').slice(0, 2).join(',')}
                      </p>

                      {/* Share Availability */}
                      <SharesDisplay
                        totalShares={property.totalShares}
                        availableShares={property.availableShares}
                        pricePerShare={property.currentPrice || property.pricePerShare}
                        size="small"
                      />

                      {/* Pricing */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        marginTop: '20px',
                        paddingTop: '20px',
                        borderTop: '1px solid rgba(255,255,255,0.08)'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price per share</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'white', marginTop: '4px' }}>
                            {property.currentPrice || property.pricePerShare} <span style={{ fontSize: '0.8rem', color: '#d4af37' }}>MATIC</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '2px' }}>
                            ≈ {maticToInr(property.currentPrice || property.pricePerShare)}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.8rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Market Value</div>
                          <div style={{ fontWeight: '600', color: '#10b981' }}>
                            {((property.currentPrice || property.pricePerShare) * property.totalShares).toFixed(0)} <span style={{ fontSize: '0.8rem' }}>MATIC</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Marketplace;
