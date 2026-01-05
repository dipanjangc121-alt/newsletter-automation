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
app.use(express.static('frontend'));
app.use('/uploads', express.static('uploads'));

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

/* MAIL TEST */
app.get('/mail-test', async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: 'Test Mail',
      text: 'Email system working successfully'
    });
    res.send('Mail sent successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/* START */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
