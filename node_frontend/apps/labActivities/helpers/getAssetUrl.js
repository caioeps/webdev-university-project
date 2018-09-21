const path = require('path');
const fs = require('fs');

const webpackConfig = require(path.resolve(APP_ROOT, 'webpack.config.js'));

const manifest = JSON.parse(
  fs.readFileSync(path.resolve(APP_ROOT, 'public', 'packs', 'manifest.json'))
);

function getAssetUrl(filename) {
  return `${webpackConfig.output.publicPath}${manifest[filename]}`;
}

module.exports = getAssetUrl;
