const express = require('express');
const router = express.Router();
const fs = require('fs');

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
  const newsletter = await Newsletter.findById(req.params.id);
  if (!newsletter) return res.status(404).send('Not found');

  res.render('newsletter', newsletter.toObject());
});

/* PDF */
router.get('/:id/pdf', async (req, res) => {
  const newsletter = await Newsletter.findById(req.params.id);
  if (!newsletter) return res.status(404).send('Not found');

  const pdfPath = await generatePDF(newsletter, req);
  res.download(pdfPath, () => fs.unlinkSync(pdfPath));
});

module.exports = router;
