import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import Loading from "../../Assets/Loading/Loading";
import { useNavigate } from "react-router-dom";

const AuthLoading = (props) => {
  const { user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  if (isAuthenticated) {
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user.sub,
        email: user.email,
        firstName: user.given_name,
        lastName: user.family_name,
      }),
    };

    fetch(`https://qsignapi.azurewebsites.net/AuthLogin`, requestOptions)
      .then((p) => {
        if(p.status === 200) return p.json();
        else alert("Something went wrong");
      })
      .then((p) => {
        props.setIsLoggedIn(true);
        props.setUserInfo({id: p.id, publicId: p.publicId,firstName: p.firstName, lastName: p.lastName, email: p.email, pubKeyPem: p.pubKeyPem, privKeyPem: p.privKeyPem});
        navigate("/Profile");
      });
  }

  return <Loading />;
};

export default AuthLoading;
