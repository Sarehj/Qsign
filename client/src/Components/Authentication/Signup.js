import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './form.css';
import LogInHeader from "./LogInHeader";


const Signup = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");

  const [error, setError] = useState("");
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if(password !== confirmPassword)
      {
        setError("Password doesn't match");
        return;
      }
      const requestOptions = {
        method: 'POST',
        headers: { 'Accept': 'application/json',
                  'Content-Type': 'application/json' },
        body: JSON.stringify({email: email, firstName: name, lastName: lastname, password: password})
      };
      var response = await fetch("https://qsignapi.azurewebsites.net/CreateAccount", requestOptions);
      
      if(response.status === 409)
      {
        setError("Email already exist");
      }
      if(response.status === 201)
      {
        navigate("/Login");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-container">
      <LogInHeader isLoggedIn={props.isLoggedIn} userInfo={props.userInfo} />
    <div className="login-box">
       <form className="form">
            <h1>Create Account</h1>
                <input
                type="text"
                className="input-type-text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                />

                <input
                type="text"
                className="input-type-text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First Name"
                required
                />

                <input
                type="text"
                className="input-type-text"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
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
                
                <input
                type="password"
                className="input-type-text"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                />

                <button className="form-button" type="submit" onClick={handleSubmit} id="btnAddTodo">Crete Account</button>
                <p style={{color: "red"}}>{error}</p>
                <p><Link to="/Login">Already have an account? Log in</Link></p>
        </form>
      </div>  
    </div>
  );
};

export default Signup;
