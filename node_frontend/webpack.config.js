const path = require('path');

const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
  mode: 'development',
  entry: {
    labActivities: path.resolve(__dirname, 'apps', 'labActivities', 'assets', 'packs', 'application.js')
  },
  output: {
    path: path.resolve(__dirname, 'public', 'packs'),
    filename: '[name]/application.[hash].js',
    publicPath: '/public/packs/'
  },
  plugins: [
    new ManifestPlugin()
  ]
};
