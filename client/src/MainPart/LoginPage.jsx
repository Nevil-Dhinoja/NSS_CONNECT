// // import React from "react";
// // import "./Registration.css";
// // import "./LoginForm.css";
// // import logoNSS from "../assets/NSS.png";
// // import logoCharusat from "../assets/5.jpg";
// // import logoNss from "../assets/login2.png";

// // function LoginPage() {
  

// //     return (
// //       <>
// //  <div className="login-container">
// //        <div className="logo-section">
// //          <img src={logoNSS} alt="NSS Logo" className="nss-logo" />
// //          <h1 className="Slogan">"Not Me, But <span className="heilight">You"</span></h1>
// //        </div>
      
// //      <div className="login-card" style={{background:"#f2f2f2"}}>
// //        <img src={logoCharusat} alt="Charusat Logo" className="charusat-logo" />
// //        <form className="form">
// //          <center><input type="text" placeholder="Username" className="input-field" /></center>
// //          <center><input type="password" placeholder="Password" className="input-field" /></center>

// //          <center><br/>
// //          <a href="#" className="forgot-password">Register /</a>
// //          <a href="#" className="forgot-password">Forgot your password </a>
         
// //          <br/></center>
         
// //          <button type="submit" className="login-button" style={{marginLeft:"200px",width:"200px"}}>Login</button>
// //          <center><img src={logoNss} alt="NSS Logo" className="Nss-logo" /></center>
// //        </form>
// //      </div>
// //      </div>
// //       </>
// //     )
// //   }
  
// //   export default LoginPage

// import { useEffect } from "react";

// function LoginPage() {
//   useEffect(() => {
//     window.location.href = process.env.REACT_APP_DASHBOARD_URL || "http://localhost:8080/"; // your dashboard app's login
//   }, []);

//   return <p>Redirecting to NSS Dashboard Login...</p>;
// }

// export default LoginPage;


import { useEffect } from "react";

function LoginPage() {
  useEffect(() => {
    window.location.href = import.meta.env.VITE_DASHBOARD_URL || "http://172.16.11.213:8080/"; // your dashboard app's login
  }, []);

  // return <p>Redirecting to NSS Dashboard Login...</p>;
}

export default LoginPage;