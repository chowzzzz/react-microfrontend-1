# React app with Webpack 5 boilerplate code

This is a boilerplate React app with Webpack 5. It also includes Redux and Tailwind CSS.

This boilerplate code uses Ant Design System, you can customise the theme in webpack.config.js or App.css (for global overrides).

## Usage

---

Feel free to clone this repo and run:

```javascript
$ npm start
```

If there is a need to set up your environment variables, create your own `.env` file and input your own values. The `.env.example` file shows an example of what can be included.

## Folder structure

---

This is the template of how our folder will be structured.

    |── src
        ├── api
        │   ├── apiHandler.js
        │   ├── articleApi.js
        │   ├── categoryApi.js
        │   └── userApi.js
        ├── common
        │   ├── components
        │   │   └── ArticleComponent.jsx
        │   └── containers
        │       └── ArticleContainer.js
        ├── index.js
        ├── pages
        │   ├── CategoryPage
        │   │   ├── CategoryPageContainer.js
        │   │   └── components
        │   │       └── CategoryPageComponent.jsx
        │   └── HomePage
        │       ├── components
        │       │   ├── ArticleListComponent.jsx
        │       │   ├── CategoryComponent.jsx
        │       │   └── HomePageComponent.jsx
        │       └── HomePageContainer.js
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


### References:

---

-   [Setting up Webpack 5 with React and Babel from scratch [2021]](https://dev.to/riyanegi/setting-up-webpack-5-with-react-and-babel-from-scratch-2021-271l)
-   [Creating a React App… From Scratch.](https://medium.com/@JedaiSaboteur/creating-a-react-app-from-scratch-f3c693b84658)
-   [Getting Started with React Redux](https://react-redux.js.org/introduction/getting-started)
-   [Set Up Tailwind In React - The fastest way! 🚀](https://dev.to/saviomartin/set-up-tailwind-in-react-the-fastest-way-2a4d)

-   [Ant Design: Customize Theme](https://ant.design/docs/react/customize-theme)
-   [Theming Ant Design : A Detailed Step by Step Guide](https://www.talon.one/blog/theming-ant-design-a-detailed-step-by-step-guide)
