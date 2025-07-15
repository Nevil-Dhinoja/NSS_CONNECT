import './style.css'
import './nav.css'
import image1 from "../assets/5.jpg";
import image2 from "../assets/NSS.png";

import { Link } from "react-router-dom";


function Nav() {
  

    return (
      <>
      <div className='Nav'>

        <div className="leftLogo">
               <img className='img1' src={image1} alt="" />
               <img className='img2' src={image2} alt="" />

        </div>
        
        <div className="Menu">
          
        <button><Link to="/home">Home</Link></button>
        <button><Link to="/about">About</Link></button>
        <button><Link to="/our-team">Our Team</Link></button>
        <button><Link to="/events">Events & Activities</Link></button>
        <button><Link to="/annual-camp">Annual Camp</Link></button>
        <button className="LogIn">
          <Link to="/login" style={{ color: "white" }}>Log In</Link>
        </button>
          
        </div>

      </div>
       
      </>
    )
  }
  
  export default Nav