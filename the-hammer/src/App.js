import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./Login";
import ProtectedRoutes from "./ProtectedRoutes";

export default function App() {
  return (
    <div className="app">
      <Switch>
        <Route exact path="/" component={Login} />
        <ProtectedRoutes path="/dashboard" />
      </Switch>
    </div>
  );
}
