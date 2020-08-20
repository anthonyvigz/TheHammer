import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  return (
    <div className="app">
      <Switch>
        <Route exact path="/" component={Login} />
        <ProtectedRoute />
      </Switch>
    </div>
  );
}
