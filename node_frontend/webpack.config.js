const path = require('path');

const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== 'production'

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
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name]/application.[hash].css',
      chunkFilename: '[name]/chunk.[hash].css',
      publicPath: 'public/packs/'
    }),
    new ManifestPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['es2015'] }
        }
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader', // translates CSS into CommonJS
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader', // compiles Sass to CSS
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
};
