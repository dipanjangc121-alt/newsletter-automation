const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

module.exports = async function generatePDF(newsletter) {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();

    const previewURL = `https://newsletter-backend-mgo0.onrender.com/api/newsletters/${newsletter._id}/preview`;

    // Load preview page
    await page.goto(previewURL, {
      waitUntil: 'networkidle0',
      timeout: 0
    });

    // 🔥 WAIT FOR ALL IMAGES (THIS FIXES PDF IMAGE ISSUE)
    await page.evaluate(async () => {
      const images = Array.from(document.images);
      await Promise.all(
        images.map(img => {
          if (img.complete) return;
          return new Promise(resolve => {
            img.onload = img.onerror = resolve;
          });
        })
      );
    });

    const pdfDir = path.join(__dirname, '../pdfs');
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);

    const pdfPath = path.join(pdfDir, `${newsletter._id}.pdf`);

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true
    });

    return pdfPath;
  } catch (err) {
    console.error('PDF ERROR:', err);
    throw err;
  } finally {
    if (browser) await browser.close();
  }
};
