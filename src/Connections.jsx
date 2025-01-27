import React from "react";
import "../css/Connections.css";
import Login from "./Login";
import Register from "./Register";

const Connections = (props) => {
  return (
    <div className="container-connections">
      {props.showSignIn ? <Register /> : <Login />}
    </div>
  );
};

export default Connections;
