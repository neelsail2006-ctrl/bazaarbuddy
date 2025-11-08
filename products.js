const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/Auth');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('📥 Fetching all products...');
    const products = await Product.find()
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });
    console.log('✅ Found', products.length, 'products');
    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    console.log('📥 Fetching product:', req.params.id);
    const product = await Product.findById(req.params.id).populate('seller', 'name email');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private (requires auth)
router.post('/', auth, async (req, res) => {
  try {
    console.log('📥 Create product request received');
    console.log('Request body:', req.body);
    console.log('User ID from auth:', req.user.id);

    const { name, description, price, image } = req.body;

    // Validation
    if (!name || !description || !price || !image) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ message: 'Please provide all required fields: name, description, price, image' });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    // Create product
    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      image,
      seller: req.user.id
    });

    console.log('💾 Saving product to database...');
    await product.save();
    
    console.log('📍 Populating seller information...');
    await product.populate('seller', 'name email');

    console.log('✅ Product created successfully:', product._id);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: product
    });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   PUT /api/products/:id/sold
// @desc    Mark product as sold
// @access  Private (requires auth)
router.put('/:id/sold', auth, async (req, res) => {
  try {
    console.log('📥 Mark as sold request:', req.params.id);
    console.log('User ID:', req.user.id);

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      console.log('❌ Product not found');
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the seller
    if (product.seller.toString() !== req.user.id) {
      console.log('❌ User is not the seller of this product');
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    product.status = 'sold';
    await product.save();

    console.log('✅ Product marked as sold:', product._id);
    res.json({
      success: true,
      message: 'Product marked as sold',
      product: product
    });
  } catch (error) {
    console.error('❌ Error marking product as sold:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (requires auth)
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('📥 Delete product request:', req.params.id);
    console.log('User ID:', req.user.id);

    const product = await Product.findById(req.params.id);

    if (!product) {
      console.log('❌ Product not found');
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the seller
    if (product.seller.toString() !== req.user.id) {
      console.log('❌ User is not the seller of this product');
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);

    console.log('✅ Product deleted:', req.params.id);
    res.json({ 
      success: true,
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;