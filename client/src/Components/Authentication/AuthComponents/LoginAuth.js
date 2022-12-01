import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import './LoginAuth.css'

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();


  return ( !isAuthenticated && (
     <button className="btn-login-auth0" onClick={() => loginWithRedirect()}>Log In Auth</button>
     )
  );
};

export default LoginButton;