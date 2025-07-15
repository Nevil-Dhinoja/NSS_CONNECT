import React, { useState } from "react";
import "./Mission.css";
import Provost from "../assets/Provost.jpg";
import RD from "../assets/RD.jpg";
import PCD from "../assets/PCD1.jpeg";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

const Mission = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
<div className="mission-Page">
  <div className="Mission-Container">  
    <div className="Titel">
      <h2>Mission</h2>
    </div>
    <div className="Missio-writeup">
    <p>
      To Develop socially responsible, service-oriented individuals who contribute to nation-buliding through leadership,ethhic service,and community Engagement.
    </p>
    </div>
  </div>
  <div className="Vission-Container">
    <div className="Titel">
      <h2>Vision</h2>
    </div>
    <div className="Vission-writeup">
      <p>
        To inspire selfless service,leadership and teamwork through Collaboration and community development, Upholding the NSS motto,"Not Me, But You."
      </p>
    </div>
  </div>
  <header className="MessageDesk">Message</header>
  <div className="msg-con">
  <div className="msg-P-desk">
  
  <div className="Titel">
      <h2>Provost</h2>
    </div>
  <div className="Msg">
      <p className="MsgPera">
        Education is not just about Knowledge ,it's about responsiblity The NSS unit at CHARUSAT  fosters a culture of service , leadership and community Engagement,
        shapping our students into responsible citizens. We take immense pride in the efforts of our NSS volenteers,Who selflessly work towords creating a better socity. 
      </p>
      <div className="IName">
    <img src={Provost} alt="PRovost image" className="Provost" />
    <h3 className="Name">DR R.V Upadhyay</h3>
    </div>
    </div>
  </div>
    <div className="Msg-R-desk">
    <div className="Titel">
      <h2>Registerar</h2>
    </div>
     <div className="Msg">
      <p className="MsgPera">
      The Nss Unit is an integral part of CHARUSAT's Commmitment to holistic education.Through This platform, our student learn the true essence of service,empthy and leadership
      i encorrage all volenteers to vontinue their efforts in making a positive impact.   
      </p>
      <div className="IName">
      <img src={RD} alt="Registerar image" className="RD" />
      <h3 className="Name">Dr Atul Patel</h3>
      </div>
      </div>
    </div>
    <div className="Msg-PC-desk">
    <div className="Titel">
      <h2>Program Coordinator</h2>
    </div>
      <div className="Msg">
      <p className="MsgPera">
      At CHARUSAT the National Service Scheme (NSS) Cell plays a pivotal role in shaping responsible,active and socially aware citizens.it encourages studetns to engage in community
      service,fostering the values of selflesness, compassion and leadership Through various social   
      </p>
      <div className="IName">
      <img src={PCD} alt="PC image" className="PCD" />
      <h3 className="Name">Kishan Patel</h3>
      </div>
      </div>
    </div>
    </div>
    
    <div className="DContainer">
      <h2 className="DTitle">Duties of Volunteer</h2>
      <div className="DutyDescription">
        <p> 
          To serve the community and uphold the values of NSS

          To participate actively in community development programa

          To foster leadership, teamwork, and problem-solving skills

          To uphold ethical and moral responsibilities in all activities

          To commit to social awareness and sustainable development 
        </p>
        <p>
        The NSS Unit at CHARUSAT was started in the year 2014. Since then it has been a
        vibrant and active unit.
        </p>
      </div>
      </div>
{/* Contact section */}
<div className="footer-container">
  <div className="contact-info">
  <div className="CTitle">
  <h2>Contact Info</h2>
  </div>
  <p>Welcome to our Website. We are glad to have you around.</p>
  <div className="info-item">
    <FaPhone className="icon" />
    <div>
      <h3>Phone :</h3>
      <p>+91 2697 265287</p>
    </div>
  </div>
  <div className="info-item">
    <FaEnvelope className="icon" />
    <div>
      <h3>Email :</h3>
      <p>principal.depstar@charusat.ac.in</p>
    </div>
  </div>
  <div className="info-item">
    <FaMapMarkerAlt className="icon" />
    <div>
      <h3>Location :</h3>
      <p>Off. Nadiad-Petlad Highway, Changa-388421, Anand, Gujarat, India</p>
    </div>
  </div>
  <div className="social-icons">
    <FaFacebook className="social-icon" />
    <FaTwitter className="social-icon" />
    <FaLinkedin className="social-icon" />
  </div>
</div>
<div className="quick-links">
  <h2>Quick Links</h2>
  <ul>
    <li><a href="#">Career</a></li>
    <li><a href="#">CENTER & CELLS</a></li>
    <li><a href="#">AICTE Mandatory Disclosure</a></li>
    <li><a href="#">AICTE Feedback</a></li>
  </ul>
</div>
</div>
</div>
      );
    };
    
export default Mission;