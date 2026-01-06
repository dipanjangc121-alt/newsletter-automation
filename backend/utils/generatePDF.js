const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const path = require('path');
const fs = require('fs');

const generatePDF = async (html) => {
  // Ensure temp folder exists
  const tempDir = path.join(__dirname, '../temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: 'networkidle0'
  });

  const pdfPath = path.join(tempDir, 'newsletter.pdf');

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true
  });

  await browser.close();
  return pdfPath;
};

module.exports = generatePDF;
