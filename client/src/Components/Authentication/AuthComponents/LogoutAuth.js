import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import './LogoutAuth.css'

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();

  return ( isAuthenticated && (
    <button className="btn-logout-auth0" onClick={() => logout({ returnTo: `${window.location.origin}` })}>Log Out Auth</button>
  )
  );
};

export default LogoutButton;