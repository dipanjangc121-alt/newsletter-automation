const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

module.exports = async function generatePDF(html) {
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

    // ✅ IMPORTANT: Set HTML content and WAIT for network & images
    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });

    // ✅ EXTRA SAFETY: Ensure all images are fully loaded
    await page.evaluate(async () => {
      const images = Array.from(document.images);
      await Promise.all(
        images.map(img => {
          if (img.complete && img.naturalHeight !== 0) return;
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );
    });

    // ✅ Ensure pdf directory exists
    const pdfDir = path.join(__dirname, '../pdfs');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    const pdfPath = path.join(pdfDir, `newsletter-${Date.now()}.pdf`);

    // ✅ Generate PDF
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm'
      }
    });

    return pdfPath;

  } catch (err) {
    console.error('❌ PDF GENERATION ERROR:', err);
    throw err;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
