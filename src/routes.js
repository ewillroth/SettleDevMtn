import React from "react";
import { Switch, Route } from "react-router-dom";
import Splash from "./components/Splash";
import Auth from "./components/Auth";
import Register from "./components/Register";
import Settle from "./components/Settle";
import Dashboard from "./components/Dashboard";
import PrivacyPolicy from "./components/Legal/PrivacyPolicy";
import TermsOfService from "./components/Legal/TermsOfService";

export default (
	<Switch>
		<Route path="/auth" component={Auth}></Route>
		<Route path="/privacypolicy" component={PrivacyPolicy}></Route>
		<Route path="/termsofservice" component={TermsOfService}></Route>
		<Route path="/register" component={Register}></Route>
		<Route path="/dashboard" component={Dashboard}></Route>
		<Route path="/settle/:id" component={Settle}></Route>
		<Route path="/" component={Splash}></Route>
	</Switch>
);
