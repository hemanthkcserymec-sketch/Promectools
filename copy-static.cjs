const fs = require('fs');
const path = require('path');

const copyDir = (src, dest) => {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, {
    recursive: true,
    force: true,
    filter: (source) => !source.includes('pressure_washer_frames') && !source.includes('originals_backup') && !source.includes('Customer videos')
  });
  console.log(`[copy-static] Copied folder ${src} -> ${dest}`);
};

const copyFile = (src, dest) => {
  if (!fs.existsSync(src)) return;
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`[copy-static] Copied file ${src} -> ${dest}`);
};

copyDir('vendor', 'dist/vendor');
copyDir('assets', 'dist/assets');
copyDir('inquiryform', 'dist/inquiryform');
copyFile('inquiryform.html', 'dist/inquiryform.html');
copyFile('privacy-policy.html', 'dist/privacy-policy.html');
copyFile('terms-of-service.html', 'dist/terms-of-service.html');
copyFile('terms-of-use.html', 'dist/terms-of-use.html');
copyFile('cancellation-policy.html', 'dist/cancellation-policy.html');
copyFile('cancelation-policy.html', 'dist/cancelation-policy.html');
copyFile('refund-policy.html', 'dist/refund-policy.html');
copyFile('slater-custom.js', 'dist/slater-custom.js');
copyFile('main.js', 'dist/main.js');
copyFile('promec-logo.svg', 'dist/promec-logo.svg');
copyFile('favicon.ico', 'dist/favicon.ico');
copyFile('slater-custom.css', 'dist/slater-custom.css');
copyFile('custom-enhancements.css', 'dist/custom-enhancements.css');
copyFile('webflow-core.css', 'dist/webflow-core.css');
copyFile('_redirects', 'dist/_redirects');
copyFile('public/_redirects', 'dist/_redirects');
console.log('[copy-static] Static files copied successfully.');
