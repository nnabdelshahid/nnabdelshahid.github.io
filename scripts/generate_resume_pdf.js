// Retained command name for compatibility; the reviewed PDF is no longer generated.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const source = JSON.parse(fs.readFileSync(path.join(root, 'resume/resume.json'), 'utf8'));
const pdf = fs.readFileSync(path.join(root, 'resume/Nader_Abdelshahid_Resume.pdf'));
const actual = crypto.createHash('sha256').update(pdf).digest('hex');
if (actual !== source.pdfSha256) {
  throw new Error('Resume PDF differs from the reviewed source. Replace the PDF and update resume/resume.json together after reviewing the new resume.');
}
console.log('Verified approved resume PDF; no files generated or overwritten.');
