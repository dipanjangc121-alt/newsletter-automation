const express = require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const { sendNewsletterEmail } = require('../utils/mailer');

const Newsletter = require('../models/Newsletter');
const upload = require('../middleware/upload');
const generatePDF = require('../utils/generatePDF');

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

/* PREVIEW */
router.get('/:id/preview', async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).send('Newsletter not found');
    }

    res.render('newsletter', {
      newsletter: newsletter.toObject()
    });
  } catch (err) {
    console.error('Preview error:', err);
    res.status(500).send('Preview error');
  }
});


/* PDF */
router.get('/:id/pdf', async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) return res.status(404).send('Not found');

    const html = await ejs.renderFile(
      path.join(__dirname, '../views/newsletter.ejs'),
      { newsletter: newsletter.toObject() }
    );

    const pdfPath = await generatePDF(html);

    res.download(pdfPath, () => {
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('PDF generation failed');
  }
});

/* CREATE + PDF + EMAIL */
router.post('/generate', upload.single('image'), async (req, res) => {
  try {
    // 1️⃣ Save newsletter
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

    // 2️⃣ Render EJS → HTML
    const html = await ejs.renderFile(
      path.join(__dirname, '../views/newsletter.ejs'),
      { newsletter: savedNewsletter.toObject() }
    );

    // 3️⃣ Generate PDF
    const pdfPath = await generatePDF(html);

    // 4️⃣ Send Email with PDF
    await sendNewsletterEmail(
      process.env.EMAIL_TO,   // recipient
      pdfPath
    );

    // 5️⃣ Respond with ID
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
