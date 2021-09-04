const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const { ModuleFederationPlugin } = require("webpack").container;

const port = process.env.PORT || 3000;

module.exports = {
	context: __dirname,
	entry: "./src/index.js",
	mode: "development",
	// Rules of how webpack will take our files, complie & bundle them for the browser
	module: {
		rules: [
			{
				// Extension of files which needs to be targetted by the specific loader, here is babel-loader
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.css$/,
				// Needs to be in this order, css-loader turns css to js files, style-loader extracts css into files as string
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: "style-loader"
					},
					{
						loader: "css-loader"
					},
					{
						loader: "less-loader",
						options: {
							lessOptions: {
								modifyVars: {
									// hack: `true; @import "${path.resolve(
									// 	__dirname,
									// 	"theme.less"
									// )}"`
									"primary-color": "#494097",
									"font-family":
										"Source Sans Pro -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"
								},
								javascriptEnabled: true
							}
						}
					}
				]
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
				type: "asset/resource"
			}
		]
	},
	// Extensions that Webpack will resolve - import modules without needing to add their extensions
	// resolve: { extensions: ["*", ".js", ".jsx"] },
	// Where files should be sent once they are bundled
	output: {
		path: path.join(__dirname, "/dist"),
		filename: "index.bundle.js",
		clean: true
	},
	// webpack 5 comes with devServer which loads in development mode
	devServer: {
		port: port,
		hot: true,
		historyApiFallback: true
	},
	// HtmlWebpackPlugin ensures webpack knows which html file template to follow
	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/index.html",
			filename: "./index.html",
			favicon: "./public/favicon.ico",
			manifest: "./public/manifest.json"
		}),
		new ESLintPlugin(),
		new Dotenv(),
		new ModuleFederationPlugin({
			name: "react-webpack",
			library: { type: "var", name: "react-webpack" },
			filename: "remoteEntry.js",
			remotes: {},
			exposes: {},
			shared: ["react", "react-dom", "react-router-dom"]
		})
	]
};
