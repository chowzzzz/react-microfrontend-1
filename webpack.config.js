const HtmlWebPackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const deps = require("./package.json").dependencies;
module.exports = {
	mode: "development",
	entry: "./src/index",
	output: {
		publicPath: "http://localhost:8080/"
	},

	resolve: {
		extensions: [".jsx", ".js", ".json"]
	},

	devServer: {
		port: 8080
	},

	module: {
		rules: [
			{
				test: /\.m?js/,
				type: "javascript/auto",
				resolve: {
					fullySpecified: false
				}
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
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
				type: "asset/resource",
				generator: {
					filename: "[name][ext][query]"
				}
			}
		]
	},

	plugins: [
		new ModuleFederationPlugin({
			name: "app1",
			library: { type: "var", name: "app1" },
			filename: "remoteEntry.js",
			remotes: {
				app2: "app2"
			},
			exposes: {
				"./Navigation": "./src/components/NavigationComponent"
			},
			shared: {
				...deps,
				react: {
					singleton: true,
					requiredVersion: deps.react
				},
				"react-dom": {
					singleton: true,
					requiredVersion: deps["react-dom"]
				}
			}
		}),
		new HtmlWebPackPlugin({
			template: "./public/index.html",
			filename: "./index.html",
			favicon: "./public/favicon.ico",
			manifest: "./public/manifest.json"
		}),
		new FaviconsWebpackPlugin("./src/logo.svg"),
		new ESLintPlugin()
	]
};
