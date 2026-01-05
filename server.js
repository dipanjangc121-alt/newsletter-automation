require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');  

const connectDB = require('./config/db');
const transporter = require('./utils/mailer');

const app = express();

/* ✅ REQUIRED MIDDLEWARE */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.set('view engine', 'ejs');                          // ✅ ADD
app.set('views', path.join(__dirname, 'views'));        // ✅ ADD

/* ✅ CONNECT MONGODB */
connectDB();

/* ✅ ROUTES */
app.use('/api/newsletters', require('./routes/newsletterRoutes'));


/* ✅ BASIC TEST ROUTE */
app.get('/', (req, res) => {
  res.send('Backend is running');
});

/* ✅ TEMPORARY EMAIL TEST ROUTE */
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
    console.error('Mail error:', error.message);
    res.status(500).send(error.message);
  }
});

/* ✅ START SERVER */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
