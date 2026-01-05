const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function sendNewsletterEmail({ to, subject, html, attachmentPath }) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
    attachments: attachmentPath
      ? [{ filename: 'newsletter.pdf', path: attachmentPath }]
      : []
  });
}

module.exports = { sendNewsletterEmail };
