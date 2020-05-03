const path = require('path');
var nodeExternals = require('webpack-node-externals');

const buildDist = path.resolve(__dirname);

module.exports = {
  entry: ['./electron/main.ts'],
  externals: [nodeExternals()],
  output: {
    path: buildDist,
    filename: 'main.js'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.mjs'],
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true
        },
        exclude: /node_modules/
      },
    ]
  },
  target: 'electron-main',
  context: __dirname,
  node: {
    __filename: false,
    __dirname: false
  },
};
