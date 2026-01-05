const mongoose = require('mongoose');

const NewsletterSchema = new mongoose.Schema(
  {
    issue: { type: String, required: true },
    month: { type: String, required: true },
    publishDate: Date,

    category: String,
    title: { type: String, required: true },
    description: String,

    image: String,
    link: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Newsletter', NewsletterSchema);
