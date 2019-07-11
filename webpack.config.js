const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (env, options) => {
	const config = {
		mode: options.mode,
		entry: './src/js/index.js',
		output: {
			path: path.resolve(__dirname, './dist'),
			filename: './js/bundle.js',
		},
		module: {
			rules: [
				{
					test : /\.js$/,
					exclude : /node_modules/,
					use : {
						loader : "babel-loader",
						options : {
							presets : ["@babel/preset-env"]
						}
					}
				},
				{
					test: /\.(sa|sc|c)ss$/,
					use: [
						MiniCssExtractPlugin.loader,
						"css-loader",
						"postcss-loader",
						{loader: "sass-loader", options: {sourceMap: true, outputStyle: 'expanded'}} // nested(default), expanded(표준), compact(한줄), compressed(압축)
					]
				},
				// html에 있는 이미지 파일은 로더 해석 못해서 이미지 추출 못함
				{
					test: /\.(png|jpe?g|gif)$/,
					loader: 'file-loader',
					options: {	
						useRelativePath: true,
						outputPath: './images', // 대상파일을 저장할 경로 지정
						publicPath: '../images', // 번들링 될 상대경로 지정
						name: '[name].[ext]',
					}
				},
			]
		},
		plugins: [
			// 스타일 추출하여 파일로 구성하는 플러그인
			new MiniCssExtractPlugin({
				filename: './css/common.css',
			}),	
		]
	}
	if (options.mode === "development") {
		config.plugins.push(
			// HMR
			new webpack.HotModuleReplacementPlugin(),

			// 작업 html 파일 
			new HtmlWebpackPlugin({ 
				filename: './src/index.html', 
				template: './src/index.html'
			}),
			
		);
		config.devServer = {
			host : "localhost",
			port : 85,
      openPage: ''
			// disableHostCheck: true,
			// index : "index.html"
		};
	} else {
		// product 모드
		config.plugins.push(
			// dist 파일 초기화  
			new CleanWebpackPlugin(),

			// 추출할 html 파일
			new HtmlWebpackPlugin({ 
				filename: 'index.html', 
				template: './src/index.html'
			}),
			// static에 있는 images, js폴더 -> dist로 복사
			new CopyPlugin([
				{
					from: path.resolve(__dirname, './src/images/sample'),
					to:path.resolve(__dirname, './dist/images/sample'),
				},
			]),
		)
	}
	return config;
};