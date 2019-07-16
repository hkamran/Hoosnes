const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    cache: true,
    mode: 'development',
    resolve: {
      modules: [
        'node_modules',
        path.join(__dirname, 'node_modules')
      ],
      extensions: ['.js', '.ts', '.jsx', '.tsx']
    },
    entry: __dirname + '/src/main/web/Main.tsx',
    externals:[],
    output: {
      path: path.join(__dirname + '/target'),
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          enforce: 'pre',
          loader: require.resolve('tslint-loader'),
          query: {
			formatter: 'stylish',
			configFile: './tslint.json'
		  }
        },
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          loader: require.resolve('ts-loader')
        },
		{ test: /.html$/, use: 'raw-loader' },
		{ test: /\.json$/, use: 'json-loader' },
		{ test: /\.(s*)css$/, use:['style-loader','css-loader', 'sass-loader'] },
		{ test: /\.woff(\?.+)?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff' },
		{ test: /\.woff2(\?.+)?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff' },
		{ test: /\.ttf(\?.+)?$/, use: 'file-loader' },
		{ test: /\.eot(\?.+)?$/, use: 'file-loader' },
		{ test: /\.svg(\?.+)?$/, use: 'file-loader' },
		{ test: /\.png$/, use: 'url-loader?mimetype=image/png' },
		{ test: /\.gif$/, use: 'url-loader?mimetype=image/gif' }
      ]
    },
    plugins: [],
    devtool: 'cheap-source-map',
    performance: {
      maxAssetSize: 1500000,
      maxEntrypointSize: 1500000
    }
};