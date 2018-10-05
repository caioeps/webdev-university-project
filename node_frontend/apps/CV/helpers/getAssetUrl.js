const path = require('path');
const fs = require('fs');

const manifest = JSON.parse(
  fs.readFileSync(path.resolve(APP_ROOT, 'public', 'packs', 'manifest.json'))
);

function getAssetUrl(filename) {
  console.log(manifest[filename])
  return manifest[filename];
}

module.exports = getAssetUrl;
