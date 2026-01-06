const puppeteer = require('puppeteer');
const path = require('path');

const generatePDF = async (html) => {
  const browser = await puppeteer.launch({
  headless: 'new',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ]
});

  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: 'networkidle0'
  });

  const pdfPath = path.join(__dirname, '../temp/newsletter.pdf');

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true
  });

  await browser.close();
  return pdfPath;
};

module.exports = generatePDF;

