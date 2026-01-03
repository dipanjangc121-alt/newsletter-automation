require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const exphbs = require('express-handlebars');

const connectDB = require('./config/db');
const newsletterRoutes = require('./routes/newsletterRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Template engine setup
app.engine(
  'hbs',
  exphbs.engine({
    extname: 'hbs',
    defaultLayout: false
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'templates'));

// Database
connectDB();

// Routes
app.use('/api/newsletter', newsletterRoutes);
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
