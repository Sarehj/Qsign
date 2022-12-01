import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogInHeader from "./LogInHeader";
import "./form.css";
import { useAuth0 } from "@auth0/auth0-react";

const Login = (props) => {
  const { loginWithRedirect } = useAuth0();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      };

      const response = await fetch(
        "https://qsignapi.azurewebsites.net/Login",
        requestOptions
      );

      if (response.status === 400) {
        setError("Wrong username or password");
      }
      if (response.status === 202) {
        const data = await response.json();
        props.setIsLoggedIn(true);
        props.setUserInfo({
          id: data[0].id,
          publicId: data[0].publicId,
          firstName: data[0].firstName,
          lastName: data[0].lastName,
          email: data[0].email,
          pubKeyPem: data[0].pubKeyPem,
          privKeyPem: data[0].privKeyPem,
        });
        navigate("/Profile");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
    <LogInHeader isLoggedIn={props.isLoggedIn} userInfo={props.userInfo} />
    <div className="login-box">
      <div className="form">
        <form>
           <h1>Login</h1>
                <input
                type="email"
                pattern=".+@globex\.com"
                className="input-type-text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                />
                
                <input
                type="password"
                className="input-type-text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                />

            <button
              className="form-button"
              type="submit"
              onClick={handleSubmit}
              id="btnAddTodo"
            >
              Login
            </button>
            
          </form>
          <div className="line-or">
            <div className="one-line"></div>
            <span className="or-span">or</span>
            <div className="one-line"></div>
          </div>

          <button className="form-button" onClick={() => loginWithRedirect()}>
            Secure Login 
          </button>
          <p style={{ color: "red" }}>{error}</p>
          <p>
            <Link to="/signup">No account? Create one</Link>
          </p>
        </div>
     </div>
    </div>
  );
};


export default Login;
