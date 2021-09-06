const HtmlWebPackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const port = process.env.PORT || 8080;

const deps = require("./package.json").dependencies;
module.exports = {
	mode: "development",
	entry: "./src/index",
	output: {
		publicPath: `http://localhost:${port}/`
	},

	resolve: {
		extensions: [".jsx", ".js", ".json"]
	},

	devServer: {
		port: port
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
		new FaviconsWebpackPlugin({
			logo: "./src/logo.svg", // svg works too!
			mode: "webapp", // optional can be 'webapp', 'light' or 'auto' - 'auto' by default
			devMode: "webapp", // optional can be 'webapp' or 'light' - 'light' by default,
			cache: true,
			favicons: {
				appName: "app1",
				appDescription: "App 1",
				developerName: "chowzzzz",
				developerURL: null, // prevent retrieving from the nearest package.json
				background: "#fff",
				theme_color: "#494097",
				icons: {
					android: false, // Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
					appleIcon: false, // Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
					appleStartup: false, // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
					coast: false, // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
					favicons: true, // Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
					firefox: true, // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
					windows: true, // Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
					yandex: false // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
				}
			}
		}),
		new ESLintPlugin(),
		new Dotenv()
	]
};
