import React, { useState } from "react";
import "../css/SignIn.css";
import Login from "./Login";

const SignIn = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [company, setCompany] = useState("");
  const [showLogIn, setShowLogIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const createAccount = () => {
    if (password !== passwordCheck) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    // Fetch or POST request to API for creating account
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage("Account created successfully");
    }, 2000); // Simulated network delay
  };

  return (
    <div className="signin-form">
      {loading && <p>Loading...</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      {showLogIn ? (
        <Login />
      ) : (
        <>
          <div className="user-inputs">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              placeholder="FirstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              placeholder="LastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <label htmlFor="email">Email Address</label>
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
            <label htmlFor="passwordCheck">Confirm Password</label>
            <input
              id="passwordCheck"
              type="password"
              placeholder="Write your password again"
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
            <label htmlFor="company">Company Name</label>
            <input
              id="company"
              type="text"
              placeholder="Company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className="user-actions">
            <button onClick={createAccount} disabled={loading}>
              Create an account
            </button>
            <button onClick={() => setShowLogIn(true)}>Login</button>
          </div>
        </>
      )}
    </div>
  );
};

export default SignIn;
