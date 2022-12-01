import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HashRouter } from "react-router-dom";

import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter>
    <Auth0Provider
      domain="dev-7ekffe016ic0nj4q.us.auth0.com"
      clientId="SX2ZecF9hbkAyBtHhdewE8ykz7oiG21I"
      redirectUri={`${window.location.origin}/#/AuthLoading`}
    >
      <App />
    </Auth0Provider>
  </HashRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
