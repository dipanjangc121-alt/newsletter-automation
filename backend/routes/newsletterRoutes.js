const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const Newsletter = require('../models/Newsletter');
const upload = require('../middleware/upload');
const generatePDF = require('../utils/generatePDF');
const { sendNewsletterEmail } = require('../utils/mailer');

/* CREATE */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const newsletter = new Newsletter({
      issue: req.body.issue,
      month: req.body.month,
      publishDate: req.body.publishDate,
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      link: req.body.link,
      image: req.file ? `${baseUrl}/uploads/${req.file.filename}` : null // ✅ FIX
    });

    await newsletter.save();
    res.status(201).json({ newsletter });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/* GET ALL */
router.get('/', async (req, res) => {
  const newsletters = await Newsletter.find().sort({ createdAt: -1 });
  res.json(newsletters);
});

/* PREVIEW */
router.get('/:id/preview', async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) return res.status(404).send('Not found');

    res.render('newsletter', {
      newsletter: newsletter.toObject()
    });

  } catch (err) {
    console.error('Preview error:', err);
    res.status(500).send('Preview error');
  }
});

/* PDF DOWNLOAD */
router.get('/:id/pdf', async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) return res.status(404).send('Not found');

    const html = await new Promise((resolve, reject) => {
      req.app.render(
        'newsletter',
        { newsletter: newsletter.toObject() },
        (err, html) => (err ? reject(err) : resolve(html))
      );
    });

    const pdfBuffer = await generatePDF(html);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=newsletter.pdf'
    });

    res.send(pdfBuffer);

  } catch (err) {
    console.error(err);
    res.status(500).send('PDF generation failed');
  }
});

/* CREATE + PDF + EMAIL */
router.post('/generate', upload.single('image'), async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const newsletter = new Newsletter({
      issue: req.body.issue,
      month: req.body.month,
      publishDate: req.body.publishDate,
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      link: req.body.link,
      image: req.file ? `${baseUrl}/uploads/${req.file.filename}` : null // ✅ FIX
    });

    const savedNewsletter = await newsletter.save();

    const html = await new Promise((resolve, reject) => {
      req.app.render(
        'newsletter',
        { newsletter: savedNewsletter.toObject() },
        (err, html) => (err ? reject(err) : resolve(html))
      );
    });

    const pdfBuffer = await generatePDF(html);

    await sendNewsletterEmail(
      process.env.EMAIL_TO,
      pdfBuffer
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
