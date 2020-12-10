import React from "react";
import { Route, Redirect } from "react-router-dom";
import Algos from "./Algos";
import Dashboard from "./Components/Dashboard";

function ProtectedRoutes() {
  // eslint-disable-next-line consistent-return
  function getToken() {
    try {
      const token = localStorage.getItem("token");
      return token;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return null;
    }
  }

  const token = getToken();

  if (!token) {
    console.log("no token");
    return <Redirect to={{ pathname: "/", error: true }} />;
  } else {
    return <Route path="/dashboard" component={Dashboard} />;
  }
}

export default ProtectedRoutes;
