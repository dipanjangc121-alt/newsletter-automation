const express = require('express');
const router = express.Router();
//const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const {
  createNewsletter,
  getNewsletters,
  getNewsletterById
} = require('../controllers/newsletterController');

const { sendNewsletterEmail } = require('../utils/mailer');
const Newsletter = require('../models/Newsletter');
const generatePDF = require('../utils/generatePDF');
/* BASIC CRUD ROUTES */
router.post('/', createNewsletter);
router.get('/', getNewsletters);
router.get('/:id', getNewsletterById);

/* HTML PREVIEW */
router.get('/:id/preview', async (req, res) => {
  const newsletter = await Newsletter.findById(req.params.id);
  if (!newsletter) return res.status(404).send('Newsletter not found');
  res.render('newsletter', newsletter.toObject());
});

/* PDF DOWNLOAD */
router.get('/:id/pdf', async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) return res.status(404).send('Newsletter not found');

    req.app.render('newsletter', newsletter.toObject(), async (err, html) => {
      if (err) {
        console.error("Render error:", err);
        return res.status(500).send("Template render failed");
      }

      try {
        const pdfPath = await generatePDF(html);
        res.download(pdfPath, 'newsletter.pdf');
      } catch (pdfErr) {
        console.error("PDF generation error:", pdfErr);
        res.status(500).send(pdfErr.message);
      }
    });
  } catch (err) {
    console.error("Route error:", err);
    res.status(500).send(err.message);
  }
});



/* EMAIL SENDING */
router.post('/:id/email', async (req, res) => {
  const { to } = req.body;

  const newsletter = await Newsletter.findById(req.params.id);
  if (!newsletter) return res.status(404).send('Newsletter not found');

  const pdfPath = path.join(__dirname, '..', 'templates', 'newsletter.pdf');

  req.app.render('newsletter', newsletter.toObject(), async (err, html) => {
    if (err) return res.status(500).send(err.message);

    try {
      await sendNewsletterEmail({
        to,
        subject: `${newsletter.issue} | ${newsletter.month}`,
        html,
        attachmentPath: fs.existsSync(pdfPath) ? pdfPath : null
      });

      res.json({ message: 'Newsletter email sent successfully' });
    } catch (e) {
      res.status(500).send(e.message);
    }
  });
});

/* EXPORT — MUST BE LAST */
module.exports = router;
