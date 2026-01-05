const Newsletter = require('../models/Newsletter');


// Create newsletter
exports.createNewsletter = async (req, res) => {
try {
const newsletter = new Newsletter(req.body);
await newsletter.save();
res.status(201).json(newsletter);
} catch (error) {
res.status(400).json({ error: error.message });
}
};


// Get all newsletters
exports.getNewsletters = async (req, res) => {
try {
const newsletters = await Newsletter.find().sort({ createdAt: -1 });
res.json(newsletters);
} catch (error) {
res.status(500).json({ error: error.message });
}
};


// Get single newsletter
exports.getNewsletterById = async (req, res) => {
try {
const newsletter = await Newsletter.findById(req.params.id);
res.json(newsletter);
} catch (error) {
res.status(404).json({ error: 'Newsletter not found' });
}
};