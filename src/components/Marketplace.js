import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/Marketplace.css';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('📥 Fetching products...');
      const response = await axios.get('http://localhost:5000/api/products');
      console.log('✅ Products fetched:', response.data);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      setError('Failed to load products. Make sure backend is running on port 5000');
      setLoading(false);
    }
  };

  const handleBuyClick = (product) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      alert(`🛍️ Purchase Confirmed!\n\nProduct: ${product.name}\nPrice: $${product.price}\n\n✅ Demo purchase successful!\n\n(Real payment integration coming soon)`);
    }
  };

  const handleMarkAsSold = async (productId) => {
    try {
      console.log('📤 Marking product as sold:', productId);
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/products/${productId}/sold`,
        {},
        {
          headers: {
            'x-auth-token': token
          }
        }
      );
      console.log('✅ Product marked as sold');
      fetchProducts(); // Refresh products
      alert('✅ Product marked as sold!');
    } catch (err) {
      console.error('❌ Error:', err);
      alert(err.response?.data?.message || 'Error updating product status');
    }
  };

  if (loading) {
    return (
      <div className="marketplace-container">
        <nav className="navbar">
          <div className="navbar-content">
            <h1 className="navbar-title">🛍️ BazaarBuddy</h1>
          </div>
        </nav>
        <div className="loading">⏳ Loading products...</div>
      </div>
    );
  }

  return (
    <div className="marketplace-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-title">🛍️ BazaarBuddy</h1>
          <div className="navbar-links">
            {isAuthenticated ? (
              <>
                <span className="user-greeting">👋 Welcome, {user?.name}!</span>
                <Link to="/sell" className="btn-sell-nav">+ Sell Product</Link>
                <Link to="/home" className="btn-logout-nav">My Account</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-login-nav">Login</Link>
                <Link to="/register" className="btn-register-nav">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="marketplace-content">
        <div className="marketplace-header">
          <h2>🏪 Available Products</h2>
          <p>Browse and buy amazing products from our sellers</p>
        </div>

        {error && <div className="error-message">⚠️ {error}</div>}

        {products.length === 0 ? (
          <div className="no-products">
            <p>📦 No products available yet. Be the first to sell! 🎉</p>
            {isAuthenticated ? (
              <Link to="/sell" className="btn-primary">Start Selling Now</Link>
            ) : (
              <>
                <p style={{ fontSize: '0.95rem', color: '#666' }}>
                  Please login or register to sell products
                </p>
                <Link to="/login" className="btn-primary">Login to Sell</Link>
              </>
            )}
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div
                key={product._id}
                className={`product-card ${product.status === 'sold' ? 'sold' : ''}`}
              >
                {/* PRODUCT IMAGE */}
                <div className="product-image-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
                    }}
                  />
                  {product.status === 'sold' && (
                    <div className="sold-badge">✓ SOLD</div>
                  )}
                </div>

                {/* PRODUCT DETAILS */}
                <div className="product-details">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-seller">👤 Seller: {product.seller?.name}</p>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">${product.price.toFixed(2)}</p>

                  {/* PRODUCT ACTIONS */}
                  <div className="product-actions">
                    {product.status === 'sold' ? (
                      <button className="btn-sold" disabled>
                        ✓ Sold
                      </button>
                    ) : (
                      <>
                        <button
                          className="btn-buy"
                          onClick={() => handleBuyClick(product)}
                        >
                          💳 Buy Now
                        </button>
                        {user?._id === product.seller?._id && (
                          <button
                            className="btn-mark-sold"
                            onClick={() => handleMarkAsSold(product._id)}
                          >
                            Mark as Sold
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>&copy; 2024 BazaarBuddy. All rights reserved. | Buy & Sell with Confidence ✨</p>
      </footer>
    </div>
  );
};

export default Marketplace;