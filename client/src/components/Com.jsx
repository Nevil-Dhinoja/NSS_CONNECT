

import './style.css'
import OurTeam from '../MainPart/OurTeam'
import AboutUs from '../MainPart/AboutUs'
import Home from './Home'
import EventPage from '../MainPart/EventPage'
import AnnualCampPage from '../MainPart/AnnualCampPage'
import LoginPage from '../MainPart/LoginPage'
import Nav from './Nav'
import Download from '../MainPart/Download'
import Footer from './Footer'




import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function Com() {
  

    return (
      <>
      <div className="com">
        
      <Router>
     
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/our-team" element={<OurTeam />} />  {/* Correct Route */}
        <Route path="/events" element={<EventPage />} />
        <Route path="/annual-camp" element={<AnnualCampPage />} />
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/download" element={<Download />} />
      </Routes>
      <Footer/>
    </Router>
      </div>
      </>
    )
  }
  
  export default Com