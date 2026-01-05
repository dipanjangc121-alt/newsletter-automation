require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

const app = express();

/* ✅ Middleware (CRITICAL) */
app.use(cors());
app.use(express.json()); // ← REQUIRED
app.use(express.urlencoded({ extended: true }));

/* ✅ Connect DB */
connectDB();

/* ✅ Routes */
app.use('/api/newsletters', require('./routes/newsletterRoutes'));

/* ✅ Test Route */
app.get('/', (req, res) => {
  res.send('Backend is running');
});

/* ✅ Start Server */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
