import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OurTeam from '../MainPart/OurTeam';
import AboutUs from '../MainPart/AboutUs';
import Home from './Home';
import EventPage from '../MainPart/EventPage';
import AnnualCampPage from '../MainPart/AnnualCampPage';
import LoginPage from '../MainPart/LoginPage';
import Download from '../MainPart/Download';
import Nav from './Nav';
import Footer from './Footer';
function Com() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/*"
          element={
            <>
              <Nav />
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/our-team" element={<OurTeam />} />
                <Route path="/events" element={<EventPage />} />
                <Route path="/annual-camp" element={<AnnualCampPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/download" element={<Download />} />
              </Routes>
              <Footer />
            </>
          }
        />

      </Routes>
    </Router>
  );
}

export default Com;
