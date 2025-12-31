const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const {
  createNewsletter,
  getNewsletters,
  getNewsletterById
} = require('../controllers/newsletterController');

const { sendNewsletterEmail } = require('../utils/mailer');
const Newsletter = require('../models/Newsletter');

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
  const newsletter = await Newsletter.findById(req.params.id);
  if (!newsletter) return res.status(404).send('Newsletter not found');

  const htmlPath = path.join(__dirname, '..', 'templates', 'temp.html');
  const pdfPath = path.join(__dirname, '..', 'templates', 'newsletter.pdf');
  const pyScript = path.join(__dirname, '..', '..', 'python-pdf', 'html_to_pdf.py');

  res.app.render('newsletter', newsletter.toObject(), (err, html) => {
    if (err) return res.status(500).send(err.message);

    fs.writeFileSync(htmlPath, html);

    exec(`python "${pyScript}" "${htmlPath}" "${pdfPath}"`, (error) => {
      if (error) return res.status(500).send(error.message);
      res.download(pdfPath, 'newsletter.pdf');
    });
  });
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
