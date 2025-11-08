import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      setLoading(false);
    }
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="home-container">Loading...</div>;
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome to BazaarBuddy!</h1>
        {user && <p>Hello, {user.name}!</p>}
        {user && <p className="user-type">Account Type: <strong>{user.userType}</strong></p>}
      </div>

      <div className="home-content">
        <p>Manage your account and start buying or selling!</p>
        {user && (
          <div className="user-info">
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
      </div>

      <div className="home-actions">
        <Link to="/marketplace" className="btn-secondary">
          🛍️ Browse Products
        </Link>
        <Link to="/sell" className="btn-secondary">
          📦 Sell Products
        </Link>
      </div>

      <button onClick={handleLogout} className="btn-logout">
        Logout
      </button>
    </div>
  );
};

export default Home;