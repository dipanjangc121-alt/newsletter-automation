const express = require('express');
const router = express.Router();
const fs = require('fs');

const Newsletter = require('../models/Newsletter');
const upload = require('../middleware/upload');
const generatePDF = require('../utils/generatePDF');
const { sendNewsletterEmail } = require('../utils/mailer');

/* CREATE */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const newsletter = new Newsletter({
      issue: req.body.issue,
      month: req.body.month,
      publishDate: req.body.publishDate,
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      link: req.body.link,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    await newsletter.save();
    res.status(201).json({ newsletter });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET ALL */
router.get('/', async (req, res) => {
  const newsletters = await Newsletter.find().sort({ createdAt: -1 });
  res.json(newsletters);
});

/* PREVIEW (✅ baseUrl INCLUDED) */
router.get('/:id/preview', async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) return res.status(404).send('Not found');

    res.render('newsletter', {
      newsletter: newsletter.toObject(),
      baseUrl: process.env.BASE_URL
    });
  } catch (err) {
    console.error('Preview error:', err);
    res.status(500).send('Preview error');
  }
});

/* PDF DOWNLOAD (✅ CORRECT USAGE) */
router.get('/:id/pdf', async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) return res.status(404).send('Not found');

    const pdfPath = await generatePDF(newsletter);

    res.download(pdfPath, () => {
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('PDF generation failed');
  }
});

/* CREATE + PDF + EMAIL (✅ COMPLETE FLOW) */
router.post('/generate', upload.single('image'), async (req, res) => {
  try {
    const newsletter = new Newsletter({
      issue: req.body.issue,
      month: req.body.month,
      publishDate: req.body.publishDate,
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      link: req.body.link,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    const savedNewsletter = await newsletter.save();

    const pdfPath = await generatePDF(savedNewsletter);

    await sendNewsletterEmail(
      process.env.EMAIL_TO,
      pdfPath
    );

    res.status(201).json({
      success: true,
      id: savedNewsletter._id
    });

  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: 'Generation failed' });
  }
});

module.exports = router;
