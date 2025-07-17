import "./style.css";
import Aboutimage1 from "../assets/aboutOne.png";
import Aboutimage2 from "../assets/aboutTwo.png";
import Aboutimage3 from "../assets/AboutThree.png";
import Aboutimage4 from "../assets/AboutFour.png";
import Aboutimage5 from "../assets/AboutSix.png";

function Badge() {
  return (
    <>
      <div className="Badge">
        <div className="BadgeToP">NSS Badge & Its Significance</div>
        <div className="BadgeBottom">
          <p><ul>
            <li>
            <b>Design & Meaning : </b>
            <br />
            </li>
          </ul>
            
          </p>

          <p style={{marginTop:"-20px"}}>
            🛞 Konark Wheel – The badge features the Konark Sun Temple Wheel,
            representing progress, movement, and continuous development. It
            reflects:
            <ul>
              <li>The dynamism of social change that NSS strives to bring.</li>
              <li>
                The self-reliant nature of students, taking responsibility for
                community welfare.
              </li>
            </ul>
          </p>

          <p>
            🔴 Red Color – Symbolizes energy and determination to serve the
            nation.
          </p>
          <p>
            🔵 Blue Color – Represents the cosmos and universal truth,
            signifying the vast impact of NSS beyond boundaries.
          </p>
          <p>
            🔄 24 Spokes – The wheel has 24 spokes, signifying that NSS
            volunteers should be ready for service round the clock.
          </p>
          <p>
            🏅 Wearing the NSS Badge – Every NSS volunteer wears this badge as a
            reminder of their duty towards the community and the nation. It
            inspires a lifelong commitment to selfless service and leadership.
          </p>
        </div>
      </div>

      <div className="AboutUs">Major NSS Events at CHARUSAT
        
      </div>

      <li style={{color:"#0765a5",width:"95%",marginTop:"40px"}}>
      The CHARUSAT NSS Unit organizes numerous impactful events throughout the year, focusing on community service, social awareness, and skill development. Some of the key events include:
      </li>

      <div className="MottoIntro2" >
        <div className="Mottobottom2" >
          <div className="Mottoleft2" ><img src={Aboutimage5} alt="" /></div>
          <div className="Mottoright2" >
            <ul>
              <li style={{  listStyleType: "none" }} >
              📢 <b>Swachhata Hi Seva Campaign</b>
                <ul>
                  <li>
                  A massive cleanliness drive across the university campus and nearby villages.
                  </li>
                  <li>
                  Volunteers participate in waste segregation, sanitation improvement, and hygiene promotion.
                  </li>
                  
                </ul>
              </li>
             
            </ul>
          </div>
        </div>
      </div>
      <div className="MottoIntro2">
        <div className="Mottobottom2" >
         
          <div className="Mottoright2" >
            <ul>
              <li style={{  listStyleType: "none" }} >
              💉 <b>Blood Donation Camps</b>
                <ul>
                  <li>
                  Encouraging students, faculty, and the local community to donate blood and save lives.
                  </li>
                  <li>
                  In collaboration with government and private blood banks.
                  </li>
                  
                </ul>
              </li>
             
            </ul>
          </div>
          <div className="Mottoleft2"><img src={Aboutimage1} alt="" /></div>
        </div>
      </div>
      <div className="MottoIntro2" >
        <div className="Mottobottom2" >
          <div className="Mottoleft2"><img src={Aboutimage2} alt="" /></div>
          <div className="Mottoright2" >
            <ul>
              <li style={{  listStyleType: "none" }} >
              🌱 <b>Tree Plantation Drives</b>
                <ul>
                  <li>
                  Promoting afforestation and environmental conservation.
                  </li>
                  <li>
                  Volunteers plant trees in schools, villages, and public spaces.
                  </li>
                  
                </ul>
              </li>
             
            </ul>
          </div>
        </div>
      </div>
      <div className="MottoIntro2">
        <div className="Mottobottom2" >
         
          <div className="Mottoright2">
            <ul>
              <li style={{  listStyleType: "none" }} >
              📚 <b>Educational Outreach Programs</b> 
                <ul>
                  <li>
                  Teaching underprivileged children in rural schools and orphanages.
                  </li>
                  <li>
                  Organizing computer literacy programs and skill development workshops.
                  </li>
                  
                </ul>
              </li>
             
            </ul>
          </div>
          <div className="Mottoleft2"><img src={Aboutimage3} alt="" /></div>
        </div>
      </div>
      <div className="MottoIntro2">
        <div className="Mottobottom2" >
          <div className="Mottoleft2"><img src={Aboutimage4} alt="" /></div>
          <div className="Mottoright2">
            <ul>
              <li style={{  listStyleType: "none" }} >
              🚀 <b>Disaster Relief & Emergency Response</b>
                <ul>
                  <li>
                  Training volunteers in first aid, emergency evacuation, and disaster management.
                  </li>
                  <li>
                  Supporting communities during natural calamities like floods, earthquakes, and cyclones.
                  </li>
                  
                </ul>
              </li>
             
            </ul>
          </div>
        </div>
      </div>

      <div className="AboutUs" style={{flexDirection:"column",height:"80px",marginTop:"100px"}}>
      Join NSS, Be the Change!
      <p style={{fontSize:"10px",fontWeight:"500"}}>
      If you are passionate about making a difference, become a part of our NSS family today and contribute to a better, brighter future!
      </p>
      
      </div>
    </>
  );
}

export default Badge;
