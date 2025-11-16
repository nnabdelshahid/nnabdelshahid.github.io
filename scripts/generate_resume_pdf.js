const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const repoRoot = path.resolve(__dirname, '..');
  const inputPath = path.resolve(repoRoot, 'resume', 'index.html');
  const outputPath = path.resolve(repoRoot, 'resume', 'Nader_Abdelshahid_Resume.pdf');

  if (!fs.existsSync(inputPath)) {
    console.error('Resume HTML not found at', inputPath);
    process.exit(1);
  }

  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.goto('file://' + inputPath, { waitUntil: 'networkidle0' });

    // Hide the on-page print button when printing
    await page.addStyleTag({ content: '.print-hide{display:none !important;}' });

    await page.pdf({
      path: outputPath,
      format: 'Letter',
      printBackground: true,
      margin: { top: '0.6in', right: '0.6in', bottom: '0.6in', left: '0.6in' }
    });

    console.log('PDF written to', outputPath);
  } finally {
    await browser.close();
  }
})();