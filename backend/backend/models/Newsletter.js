const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  heading: String,
  content: String,
  image: String
});

const NewsletterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  items: [ItemSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Newsletter', NewsletterSchema);
