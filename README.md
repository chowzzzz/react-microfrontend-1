# Usage

Run:

```javascript
$ npm start
```

If there is a need to set up your environment variables, create your own `.env` file and input your own values. The `.env.example` file shows an example of what can be included.

## Folder structure

---

This is the template of the final folder structure.

    |── public
    	├── favicon.ico
        ├── index.html
    	├── logo192.png
    	├── logo512.png
    	├── manifest.json
    |── src
        ├── api
        │   ├── apiHandler.js
        │   ├── articleApi.js
        │   ├── categoryApi.js
        │   └── userApi.js
        ├── components
        │   └── ArticleComponent.jsx
        ├── index.js
        ├── pages
        │   ├── CategoryPage.js
        │   └── HomePage.js
        ├── state
        │   ├── article
        │   │   ├── articleActions.js
        │   │   └── articleReducer.js
        │   ├── category
        │   │   ├── categoryActions.js
        │   │   └── categoryReducer.js
        │   ├── middleware.js
        │   ├── store.js
        │   └── user
        │       ├── userActions.js
        │       └── userReducer.js
        └── utils
            └── authUtils.js
    ├──.babelrc
    ├── .eslintrc.json
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── tailwindcss-config.js
    └── webpack.config.js

### References:

---

-   [Setting up Webpack 5 with React and Babel from scratch [2021]](https://dev.to/riyanegi/setting-up-webpack-5-with-react-and-babel-from-scratch-2021-271l)
-   [Creating a React App… From Scratch.](https://medium.com/@JedaiSaboteur/creating-a-react-app-from-scratch-f3c693b84658)
-   [Getting Started with React Redux](https://react-redux.js.org/introduction/getting-started)
-   [Set Up Tailwind In React - The fastest way! 🚀](https://dev.to/saviomartin/set-up-tailwind-in-react-the-fastest-way-2a4d)

-   [Ant Design: Customize Theme](https://ant.design/docs/react/customize-theme)
-   [Theming Ant Design : A Detailed Step by Step Guide](https://www.talon.one/blog/theming-ant-design-a-detailed-step-by-step-guide)

# Steps to recreate micro frontend

## Common steps

### 1. Install dependencies

```
npm init -y
npm i react react-dom react-router-dom
npm i -D @babel/cli @babel/core @babel/preset-env @babel/preset-react babel-loader babel-plugin-import file-loader css-loader style-loader webpack webpack-cli html-webpack-plugin webpack-dev-server

npm i redux react-redux antd @reduxjs/toolkit

npm i -D less less-loader

npm i -D -E prettier
```

Add scripts to `package.json`

```javascript
"scripts": {
	"start": " npm run watch:css && webpack-dev-server --mode development",
	"serve": " npm run watch:css && webpack --mode development",
	"build": " npm run watch:css && webpack --mode production",
	"test": "echo \"Error: no test specified\" && exit 1",
	"watch:css": "postcss src/styles/tailwind.css -o src/styles/output.css"
},
```

### 2. Set up Webpack with Babel

-   Create `.babelrc` and include the following presets:

```javascript
{
	"presets": ["@babel/preset-env", "@babel/preset-react"],
	"plugins": [
		[
			"import",
			{
				"libraryName": "antd",
				"libraryDirectory": "es",
				"style": true
			}
		]
	]
}
```

### 3. Set up Tailwind CSS

```
npm i -D postcss postcss-cli tailwindcss autoprefixer
```

Create `styles` folder in the `src` folder

    |── src
    	|── styles
    		├── output.css
    		└── tailwind.css

`styles/tailwind.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```
npx tailwindcss init --full
npx tailwindcss init tailwindcss-config.js -p
```

Import Tailwind CSS to `App.js`

```
import './styles/output.css'
```

### 4. Set up ESLint and Favicons

```
npm i -D eslint eslint-plugin-react eslint-plugin-react-hooks eslint-webpack-plugin favicons favicons-webpack-plugin@5.0.0 .en
```

Create `.eslintrc.json` file

```
{
	"env": {
		"browser": true,
		"node": true,
		"commonjs": true,
		"es6": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:react-hooks/recommended"
	],
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true
		},
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": ["react", "react-hooks"],
	"rules": {
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "warn"
	}
}

```

### 5. Set up `.env` file

Create a `.env` file, can reference the `.env.example` file

```
# EXAMPLE OF .env file
NODE_ENV=development
PORT=3000
```

### 6. Set up `prettier`

Create `.prettierrc.json` file

```
{
    "tabWidth": 4
}
```

Create `.prettierignore` file

```
# Ignore artifacts:
build
coverage

src/styles/output.css
```

To format files, run:

```
npx prettier --write .
```

To ensure everyone runs prettier, run:

```
npx prettier --check .
```

---

## App 1

### 1. Set up `webpack.config.js`

Create `webpack.config.js` file:

```javascript
const HtmlWebPackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const port = process.env.PORT || 3000;

const deps = require("./package.json").dependencies;
module.exports = {
    mode: "development",
    entry: "./src/index",
    output: {
        publicPath: `http://localhost:${port}/`,
    },

    resolve: {
        extensions: [".jsx", ".js", ".json"],
    },

    devServer: {
        port: port,
    },

    module: {
        rules: [
            {
                test: /\.m?js/,
                type: "javascript/auto",
                resolve: {
                    fullySpecified: false,
                },
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
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
                                        "Source Sans Pro -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
                                },
                                javascriptEnabled: true,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
                type: "asset/resource",
                generator: {
                    filename: "[name][ext][query]",
                },
            },
        ],
    },

    plugins: [
        new ModuleFederationPlugin({
            name: "app1",
            library: { type: "var", name: "app1" },
            filename: "remoteEntry.js",
            remotes: {
                app2: "app2",
            },
            exposes: {
                "./Navigation": "./src/components/NavigationComponent",
            },
            shared: {
                ...deps,
                react: {
                    singleton: true,
                    requiredVersion: deps.react,
                },
                "react-dom": {
                    singleton: true,
                    requiredVersion: deps["react-dom"],
                },
            },
        }),
        new HtmlWebPackPlugin({
            template: "./public/index.html",
            filename: "./index.html",
            favicon: "./public/favicon.ico",
            manifest: "./public/manifest.json",
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
                    yandex: false, // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
                },
            },
        }),
        new ESLintPlugin(),
        new Dotenv(),
    ],
};
```

### 2. Set up react folder

    |── public
        ├── index.html
    |── src
        ├── components
        │   └── NavigationComponent.js
        ├── pages
        │   └── HomePage.js
        ├── App.css
        ├── App.js
        ├── bootstrap.js
        ├── index.js
        └── routes.js

`public/index.html:`

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link rel="icon" href="favicon.ico" />
        <link rel="shortcut icon" href="${require('./favicon.ico')}" />
        <link rel="apple-touch-icon" href="logo192.png" />
        <link rel="manifest" href="manifest.json" />
        <script src="http://localhost:3001/remoteEntry.js"></script>
        <title>App 1</title>
    </head>

    <body>
        <div id="root"></div>
    </body>
</html>
```

`src/index.js`

```javascript
import("./bootstrap");
```

`src/bootstrap.js`

```javascript
import React from "react";
import ReactDom from "react-dom";
import App from "./App";
import "./App.css";

ReactDom.render(<App />, document.getElementById("root"));
```

`src/App.js`

```javascript
import React, { lazy } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import Navigation from "./components/NavigationComponent";
import localRoutes from "./routes";
import remoteRoutes from "app2/routes";

const routes = [...localRoutes, ...remoteRoutes];

const App = () => {
    return (
        <HashRouter>
            <div>
                <Navigation />

                <React.Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                        {routes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                component={route.component}
                                exact={route.exact}
                            />
                        ))}
                    </Switch>
                </React.Suspense>
            </div>
        </HashRouter>
    );
};

export default App;
```

`src/App.css`

```css
.App {
    margin: 1rem;
    font-family: Open Sans;
}

h1 {
    font-family: Open Sans;
    font-weight: 800 !important;
}

h2,
h3,
h4,
h5,
h6 {
    font-family: Open Sans;
    font-weight: 700 !important;
}

navbar {
    width: 100 + "vw";
    height: 80;
    background-color: "lightblue";
}
```

`src/routes.js`

```javascript
import React from "react";

const Home = React.lazy(() => import("./pages/HomePage"));

const routes = [
    {
        path: "/",
        component: Home,
        exact: true,
    },
];

export default routes;
```

`src/pages/HomePage.js`

```javascript
import React from "react";
import "../styles/output.css";

const HomePage = () => (
    <div className="bg-gray-900 p-20 h-screen flex justify-center items-start flex-col">
        <h1 className="text-5xl text-white">Home Page 👋</h1>
        <p className="text-gray-400 mt-5 text-lg">
            a page being provided by App 1
        </p>
        <p className="text-gray-400 mt-5 text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
            consequuntur odio aut nobis ab quis? Reiciendis doloremque ut quo
            fugiat eveniet tempora, atque alias earum ullam inventore itaque
            sapiente iste?
        </p>
        <button class="p-4 bg-green-600 rounded-lg font-bold text-white mt-5 hover:bg-gray-600">
            Hello Friends 🚀
        </button>
    </div>
);

export default HomePage;
```

`src/components/NavigationComponent.js`

```javascript
import { Link } from "react-router-dom";
import React from "react";

const style = { border: "1px solid #000", padding: 12 };

const Navigation = () => (
    <div style={style}>
        <Link to="/">Home</Link> - <Link to="/about">About</Link>
    </div>
);

export default Navigation;
```

### 3. Add in favicons and logos to public folder

## Final Folder Structure

    |── public
    	├── favicon.ico
        ├── index.html
    	├── logo192.png
    	├── logo512.png
    	├── manifest.json
    |── src
        ├── components
        │   └── NavigationComponent.js
        ├── pages
        │   └── HomePage.js
    	├── styles
    		├── output.css
    		└── tailwind.css
        ├── App.css
        ├── App.js
        ├── bootstrap.js
    	├── logo.svg
        ├── index.js
        └── routes.js
    ├──.babelrc
    ├── .eslintrc.json
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── tailwindcss-config.js
    └── webpack.config.js

---

## App 2

### 1. Set up `webpack.config.js`

Create `webpack.config.js` file:

```javascript
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const port = process.env.PORT || 3001;

const deps = require("./package.json").dependencies;
module.exports = {
    mode: "development",
    entry: "./src/index",
    output: {
        publicPath: `http://localhost:${port}/`,
    },

    resolve: {
        extensions: [".jsx", ".js", ".json"],
    },

    devServer: {
        port: port,
    },

    module: {
        rules: [
            {
                test: /\.m?js/,
                type: "javascript/auto",
                resolve: {
                    fullySpecified: false,
                },
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
                type: "asset/resource",
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
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
                                        "Source Sans Pro -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
                                },
                                javascriptEnabled: true,
                            },
                        },
                    },
                ],
            },
        ],
    },

    plugins: [
        new ModuleFederationPlugin({
            name: "app2",
            library: { type: "var", name: "app2" },
            filename: "remoteEntry.js",
            remotes: {
                app1: "app1",
            },
            exposes: {
                "./routes": "./src/routes",
            },
            shared: {
                ...deps,
                react: {
                    singleton: true,
                    requiredVersion: deps.react,
                },
                "react-dom": {
                    singleton: true,
                    requiredVersion: deps["react-dom"],
                },
            },
        }),
        new HtmlWebPackPlugin({
            template: "./public/index.html",
        }),
        new ESLintPlugin(),
        new Dotenv(),
    ],
};
```

### 2. Set up react folder

    |── public
        ├── index.html
    |── src
        ├── pages
        │   └── AboutPage.js
        ├── App.css
        ├── App.js
        ├── bootstrap.js
        ├── index.js
        └── routes.js

`App.css`, `index.js` and `bootstrap.js` will be the same as App 1

`public/index.html:`

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <script src="http://localhost:3000/remoteEntry.js"></script>
        <title>App 2</title>
    </head>

    <body>
        <div id="root"></div>
    </body>
</html>
```

`src/App.js`

```javascript
import React from "react";
import About from "./pages/AboutPage.js";

const App = () => <About />;

export default App;
```

`src/routes.js`

```javascript
import React from "react";

const AboutPage = React.lazy(() => import("./pages/AboutPage"));

const routes = [
    {
        path: "/about",
        component: AboutPage,
    },
];

export default routes;
```

`src/pages/AboutPage.js`

```javascript
import React from "react";
import "../styles/output.css";

const AboutPage = () => (
    <div className="bg-gray-900 p-20 h-screen flex justify-center items-start flex-col">
        <h1 className="text-5xl text-white">About Page 👋</h1>
        <p className="text-gray-400 mt-5 text-lg">
            a page being provided by App 2
        </p>
        <p className="text-gray-400 mt-5 text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
            consequuntur odio aut nobis ab quis? Reiciendis doloremque ut quo
            fugiat eveniet tempora, atque alias earum ullam inventore itaque
            sapiente iste?
        </p>
        <button className="p-4 bg-green-600 rounded-lg font-bold text-white mt-5 hover:bg-gray-600">
            Hello Friends 🚀
        </button>
    </div>
);

export default AboutPage;
```

## Final Folder Structure

    |── public
        ├── index.html
    |── src
        ├── pages
        │   └── AboutPage.js
    	├── styles
    		├── output.css
    		└── tailwind.css
        ├── App.css
        ├── App.js
        ├── bootstrap.js
    	├── logo.svg
        ├── index.js
        └── routes.js
    ├──.babelrc
    ├── .eslintrc.json
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── tailwindcss-config.js
    └── webpack.config.js
