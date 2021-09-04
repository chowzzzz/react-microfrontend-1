import React from "react";
import "./App.css";
import "./styles/output.css";
import "antd/dist/antd.less";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";

// import { Button, DatePicker, version } from "antd";

const App = () => {
	return (
		<Router>
			<div
				style={{
					width: 100 + "vw",
					height: 80,
					backgroundColor: "lightblue"
				}}
			>
				<Link to="/">Home</Link>
				<Link to="/login">Login</Link>
			</div>
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/login" exact component={Login} />
				<Route path="*" component={PageNotFound} />
			</Switch>
		</Router>
	);
};

export default App;
