import React, { useState } from "react";
import "../css/Login.css";
import SignIn from "./SignIn";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignIn, setShowSignIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const login = () => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    // Fetch or POST request to API for logging in
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage("Login successful");
    }, 2000); // Simulated network delay
  };

  return (
    <div className="login-form">
      {loading && <p>Loading...</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      {showSignIn ? (
        <SignIn />
      ) : (
        <>
          <div className="user-inputs">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="user-actions">
            <button onClick={login} disabled={loading}>
              Login
            </button>
            <button onClick={() => setShowSignIn(true)}>Sign in</button>
          </div>
          <a href="#">Forget your password?</a>
        </>
      )}
    </div>
  );
};

export default Login;
