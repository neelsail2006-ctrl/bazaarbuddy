import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SellProduct.css';

const SellProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.description || !formData.price || !formData.image) {
      setError('Please fill in all fields');
      return;
    }

    if (isNaN(formData.price) || formData.price <= 0) {
      setError('Price must be a valid positive number');
      return;
    }

    if (formData.name.length < 3) {
      setError('Product name must be at least 3 characters');
      return;
    }

    if (formData.description.length < 10) {
      setError('Description must be at least 10 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/products',
        {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          image: formData.image
        },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        }
      );

      console.log('✅ Product created:', response.data);
      alert('🎉 Product listed successfully!');
      navigate('/marketplace');
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.response?.data?.message || 'Error creating product. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sell-container">
      <div className="sell-card">
        <div className="sell-header">
          <h1>📦 List Your Product</h1>
          <p>Fill in the details below to start selling</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., iPhone 13 Pro"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product in detail (min 10 characters)"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          {formData.image && (
            <div className="image-preview">
              <p>📷 Image Preview:</p>
              <img src={formData.image} alt="Preview" onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300?text=Image+Error';
              }} />
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '⏳ Listing...' : '🚀 List Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellProduct;