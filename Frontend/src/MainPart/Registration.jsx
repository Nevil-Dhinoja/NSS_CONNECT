import React from "react";
import "./Registration.css";
import logoNSS from "../assets/NSS.png";
import logoCharusat from "../assets/5.jpg";
import logoNss from "../assets/6.png";


const Registration = () => {
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
        <input type="text" placeholder="Email" className="input-field" />
        <input type="text" placeholder="First Name" className="input-field" />
        <input type="text" placeholder="Last Name" className="input-field" />
        <input type="password" placeholder="Set Password" className="input-field" />
        <br/>
        <button type="submit" className="login-button">Register</button>
        <img src={logoNss} alt="NSS Logo" className="Nss-logo" />
      </form>
    </div>
    </div>
    
  );
};
export default Registration;