import React from "react";
import { Route, useNavigate } from "react-router-dom";

export default function AuthRoute(props) {
  const navigation = useNavigate();

  if (!localStorage.getItem("SESSION_TOKEN")) {
    return navigation("../");
    return null;
  }

  return <Route {...props} />;
}