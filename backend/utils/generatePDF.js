const puppeteer = require('puppeteer-core');

const CHROME_PATH =
  process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium';

module.exports = async function generatePDF(html) {
  let browser;

  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process'
      ]
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });

    // ✅ Ensure images are fully loaded
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

    // ✅ Generate PDF as BUFFER (Render-safe)
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm'
      }
    });

    return pdfBuffer;

  } catch (err) {
    console.error('❌ PDF GENERATION ERROR:', err);
    throw err;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
