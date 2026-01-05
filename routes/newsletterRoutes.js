const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const upload = require('../utils/upload');

const {
  createNewsletter,
  getNewsletters,
  getNewsletterById,
  sendNewsletter
} = require('../controllers/newsletterController');

/* ===============================
   CREATE NEWSLETTER
   (Logo + Image Upload)
================================ */
router.post(
  '/',
  upload.single('image'),   // ✅ BEST OPTION
  createNewsletter
);

/* ===============================
   GET ALL NEWSLETTERS
================================ */
router.get('/', getNewsletters);

/* ===============================
   GET SINGLE NEWSLETTER (JSON)
================================ */
router.get('/:id', getNewsletterById);

/* ===============================
   PREVIEW NEWSLETTER (HTML)
================================ */
router.get('/:id/preview', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send('Invalid ID');
  }

  const Newsletter = require('../models/Newsletter');
  const newsletter = await Newsletter.findById(req.params.id);

  if (!newsletter) {
    return res.status(404).send('Newsletter not found');
  }

  res.render('newsletter', newsletter.toObject());
});

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
