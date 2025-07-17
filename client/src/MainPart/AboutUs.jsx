import './MianPart.css';
import Introduction from '../components/Introduction';
import Launch from '../components/Launch';
import Family from '../components/Family';
import Vstatus from '../components/Vstatus';
import Motto from '../components/Motto';
import Objectives from '../components/Objectives';
import Badge from '../components/Badge';
import Footer from '../components/Footer';
import Download from './Download'; // Import Download page

import { Routes, Route } from "react-router-dom";

function AboutUs() {
    return (
        <>
            {/* Render all components directly */}
            <div className="com">
                <Introduction />
                <Launch />
                <Family />
                <Vstatus />
                <Motto />
                <Objectives />
                <Badge />
                {/* <Footer /> */}
            </div>

           
        </>
    );
}

export default AboutUs;
