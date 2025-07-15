import React from "react";
import "./LoginForm.css";
import logoNSS from "../assets/NSS.png";
import logoCharusat from "../assets/5.png";
// import logoNss from "../assets/6.png";
const Login = () => {
  return (
    <div className="login-container">
      <div className="logo-section">
        <img src={logoNSS} alt="NSS Logo" className="nss-logo" />
        <h1 className="Slogan">"Not Me, But <span className="heilight">You"</span></h1>
      </div>
     
    <div className="login-card">
      <img src={logoCharusat} alt="Charusat Logo" className="charusat-logo" />
      <form className="form">
        <input type="text" placeholder="Username" className="input-field" />
        <input type="password" placeholder="Password" className="input-field" />
        <br/>
        <a href="#" className="forgot-password">Register /</a>
        <a href="#" className="forgot-password">Forgot your password </a>
        
        <br/>
        <button type="submit" className="login-button" style={{marginLeft:"-15px"}}>Login</button>
        {/* <img src={logoNss} alt="NSS Logo" className="Nss-logo" /> */}
      </form>
    </div>
    </div>
    
  );
};

export default Login;