var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, './webpack-build');
var APP_DIR = path.resolve(__dirname, './built/client');

const config = {
   entry: {
     main: APP_DIR + '/index.js'
   },
   output: {
     filename: 'bundle.js',
     path: BUILD_DIR,
   },
   devtool: 'inline-source-map',
   module: {
    rules: [
     {
       test: /(\.css|.scss)$/,
       use: [{
           loader: "style-loader" // creates style nodes from JS strings
       }, {
           loader: "css-loader" // translates CSS into CommonJS
       }, {
           loader: "sass-loader" // compiles Sass to CSS
       }]
     },
    {
     test: /\.tsx?$/,
     use: 'ts-loader',
     exclude: /node_modules/,
    },
    ],

  }
};

module.exports = config;