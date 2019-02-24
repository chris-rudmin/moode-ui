const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const apiMocker = require('webpack-api-mocker');

process.env.START_APP_SERVER = process.env.START_APP_SERVER === 'true' ? 'true' : 'false';

module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
  },
  performance: {
    maxAssetSize: 1000000,
    maxEntrypointSize: 4000000,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.(pdf|jpg|png|gif|svg|ico)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[path][name]-[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.START_APP_SERVER': JSON.stringify(process.env.START_APP_SERVER),
    }),
  ],
  devServer: {
    before(app) {
      apiMocker(app, path.resolve('src/__mock_server__/index.js'));
    },
  },
};
