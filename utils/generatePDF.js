const puppeteer = require('puppeteer-core');
const chromium = require('chromium');
const path = require('path');

async function generatePDF(html) {
  const executablePath = chromium.path;

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath,
    headless: chromium.headless
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfPath = path.join(__dirname, '..', 'templates', 'newsletter.pdf');

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true
  });

  await browser.close();
  return pdfPath;
}

module.exports = generatePDF;
