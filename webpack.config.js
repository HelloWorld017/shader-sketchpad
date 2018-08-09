const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: {
		raycast: path.resolve(__dirname, 'app', 'js', 'index.js')
	},

	output: {
	  	path: path.resolve(__dirname, 'dist'),
		filename: '[name].bundle.js',
		publicPath: '/dist/'
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},

			{
				test: /\.glsl$/,
				loader: 'raw-loader'
			}
		]
	},

	mode: process.env.NODE_ENV || 'development',

	devtool: '#eval-source-map'
};
