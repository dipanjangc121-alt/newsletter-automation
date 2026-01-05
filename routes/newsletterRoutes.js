const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const upload = require('../utils/upload');
const Newsletter = require('../models/Newsletter');

const {
  createNewsletter,
  getNewsletters,
  getNewsletterById,
  sendNewsletter
} = require('../controllers/newsletterController');

/* ===============================
   CREATE NEWSLETTER
================================ */
router.post(
  '/',
  upload.single('image'),
  createNewsletter
);

/* ===============================
   GET ALL NEWSLETTERS
================================ */
router.get('/', getNewsletters);

/* ===============================
   PREVIEW NEWSLETTER (HTML)
   ⚠️ MUST COME BEFORE /:id
================================ */
router.get('/:id/preview', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send('Invalid ID');
    }

    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).send('Newsletter not found');
    }

    res.render('newsletter', newsletter.toObject());
  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).send('Preview error');
  }
});

/* ===============================
   GET SINGLE NEWSLETTER (JSON)
================================ */
router.get('/:id', getNewsletterById);

/* ===============================
   SEND PDF + EMAIL
================================ */
router.post('/:id/send', sendNewsletter);

/* ===============================
   TEST ROUTE
================================ */
router.get('/test/health', (req, res) => {
  res.json({ message: 'Newsletter API working ✅' });
});

module.exports = router;
