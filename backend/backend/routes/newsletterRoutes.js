const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

/* TEST ROUTE */
router.get('/test', (req, res) => {
  res.json({ message: 'Newsletter API working' });
});

/* CREATE */
router.post('/', async (req, res) => {
  try {
    console.log('Incoming:', req.body);
    const newsletter = new Newsletter(req.body);
    await newsletter.save();
    res.status(201).json(newsletter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* READ */
router.get('/', async (req, res) => {
  try {
    const newsletters = await Newsletter.find();
    res.json(newsletters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
