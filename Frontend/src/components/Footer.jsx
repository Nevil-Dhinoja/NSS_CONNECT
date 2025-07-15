import './style.css';
import './footer.css'
import { Link } from "react-router-dom";
import image1 from "../assets/AboutFive.png";

function Footer() {
    return (
        <div className="footer">
            <div className="footerLeft">
                <h4><b>Contact Us</b></h4>
                <p>Charotar University Of Science And Technology,<br />
                    CHARIAST Campus,<br />
                    Off. Nadiad-Petlad Highway,<br />
                    Changa-388421 <br /><br />
                    +91 2697 265011/21 <br />
                    info@charusat.ac.in <br />
                    Mon - Sat : 09:00 am to 04:30 pm <br />
                    (Except Public Holidays and 2nd & 4th Saturdays)
                </p>
            </div>

            <div className="footerMid">
                <img src={image1} alt="About Section" />
            </div>

            <div className="footerRight">
                <h4><b>Quick Links</b></h4>
                <Link to="/" >Photo Gallery</Link><br />
                <Link to="/download" >Download</Link><br />
                <Link to="/" >Adopted Villages</Link><br />
                <Link to="/" >Collaborations</Link><br />
            </div>
        </div>
    );
}

export default Footer;
