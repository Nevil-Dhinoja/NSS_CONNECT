import './style.css'
import image1 from "../assets/1.png";
import './introduction.css'


function Introduction() {
  

    return (
      <>
      <div className="AboutUs">
        About Us
      </div>

      <div className="Intro">
        <div className="top">
            Introduction

        </div>
        <div className="bottom">
            <div className="left">
    
            <ul>
                <li>
                The National Service Scheme (NSS) at CHARUSAT is a student-driven initiative dedicated to fostering a sense of social responsibility, community service, and leadership among young minds. Inspired by the core values of selfless service and nation-building, our NSS Unit provides a platform for students to engage in meaningful activities that contribute to societal development.

                </li>
                <li>
                At CHARUSAT, NSS is not just a program—it is a movement that empowers students to create a lasting impact through various initiatives, including cleanliness drives, health campaigns, environmental conservation, and rural development projects. By implementing innovative and sustainable solutions, we strive to uphold the spirit of ‘Not Me, But You’ and make a difference in the lives of people around us.
                </li>
            </ul>


            </div>
            <div className="right">
            
            <img src={image1} alt="" />

            </div>
        </div>

      </div>
       
      </>
    )
  }
  
  export default Introduction
  