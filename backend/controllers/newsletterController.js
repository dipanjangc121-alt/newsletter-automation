const Newsletter = require('../models/Newsletter');
const ejs = require('ejs');
const path = require('path');
const generatePDF = require('../utils/generatePDF');
const { sendNewsletterEmail } = require('../utils/mailer');

/* ===============================
   CREATE NEWSLETTER
================================ */
exports.createNewsletter = async (req, res) => {
  try {
    const newsletter = new Newsletter({
      issue: req.body.issue,
      month: req.body.month,
      publishDate: req.body.publishDate,
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      link: req.body.link,

      image: req.file
  ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  : ''
    });

    const savedNewsletter = await newsletter.save();
    res.status(201).json(savedNewsletter);

  } catch (error) {
    console.error('Create newsletter error:', error);
    res.status(500).json({ message: error.message });
  }
};


/* ===============================
   GET ALL NEWSLETTERS
================================ */
exports.getNewsletters = async (req, res) => {
  try {
    const newsletters = await Newsletter.find().sort({ createdAt: -1 });
    res.json(newsletters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===============================
   GET SINGLE NEWSLETTER
================================ */
exports.getNewsletterById = async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }
    res.json(newsletter);
  } catch (error) {
    res.status(400).json({ error: 'Invalid ID' });
  }
};

/* ===============================
   PDF GENERATION + EMAIL
================================ */
exports.sendNewsletter = async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    // Render EJS
    const html = await ejs.renderFile(
      path.join(__dirname, '../views/newsletter.ejs'),
      newsletter.toObject()
    );

    // Generate PDF
    const pdfPath = await generatePDF(html);

    // Send Email
    await sendNewsletterEmail(
      'student@example.com',
      pdfPath
    );

    res.json({
      success: true,
      message: 'Newsletter PDF generated and email sent'
    });

  } catch (error) {
    console.error('PDF/Email error:', error);
    res.status(500).json({ error: 'PDF or Email failed' });
  }
};
