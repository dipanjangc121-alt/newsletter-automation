require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');
const transporter = require('./utils/mailer');

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* STATIC */
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* VIEW ENGINE */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* DB */
connectDB();

/* ROUTES */
app.use('/api/newsletters', require('./routes/newsletterRoutes'));

/* TEST */
app.get('/', (req, res) => {
  res.send('Backend is running');
});

/* START */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
