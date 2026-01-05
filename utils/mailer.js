const nodemailer = require('nodemailer');

const sendNewsletterEmail = async (to, pdfPath) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"Newsletter" <${process.env.MAIL_USER}>`,
    to,
    subject: 'University Newsletter',
    text: 'Please find attached newsletter PDF.',
    attachments: [
      {
        filename: 'newsletter.pdf',
        path: pdfPath
      }
    ]
  });
};

module.exports = { sendNewsletterEmail };

