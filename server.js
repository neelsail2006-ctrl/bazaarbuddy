// server.js
require('dotenv').config(); // Load environment variables first

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== MongoDB Connection =====
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('❌ MONGO_URI is not defined in .env file!');
  process.exit(1); // Stop server if no URI
}

console.log('Attempting to connect with URI:', mongoURI);

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ===== Routes =====
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

// ===== Test Route =====
app.get('/', (req, res) => {
  res.send('✅ BazaarBuddy API is running...');
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
