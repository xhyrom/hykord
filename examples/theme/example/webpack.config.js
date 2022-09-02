const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: ['./src/index.ts', './src/index.css'],
  target: 'node',
  output: {
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(), new UglifyJsPlugin()
    ]
  },
  plugins: [new MiniCssExtractPlugin({ filename: 'index.css' })],
  // Better way? Please let me know lol
  externals: {
   'structures': 'require(\'structures\')'
  }
};
