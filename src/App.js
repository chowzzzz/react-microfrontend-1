import React from "react";
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
