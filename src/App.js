import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "../css/App.css";
import About from "./About";
import Connections from "./Connections";
import Home from "./Home";

const NavigationBar = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/login">Login</Link>
      <Link to="/signin">Sign In</Link>
    </nav>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Connections showSignIn={false} />} />
        <Route path="/signin" element={<Connections showSignIn={true} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
