const mongoose = require('mongoose');


const SectionSchema = new mongoose.Schema({
category: String,
title: String,
description: String,
image: String,
link: String
});


const NewsletterSchema = new mongoose.Schema({
issue: String,
month: String,
sections: [SectionSchema],
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Newsletter', NewsletterSchema);