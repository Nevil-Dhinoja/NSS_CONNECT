import './style.css'
import image1 from "../assets/1.png";
import Aboutimage7 from "../assets/AboutSeven.png";


function Objectives() {
  

    return (
      <>
 

      <div className="ObjectivesIntro">
        <div className="Objectivestop">
        Objectives of NSS

        </div>
        <div className="Objectivesbottom">
            <div className="Objectivesleft">
    
            <ul>
                <li>
                <b>The National Service Scheme at CHARUSAT is guided by the following objectives:</b>
                <ol>
                    <li>
                    Personality Development Through Service
                    </li>
                    <li>
                    Civic Responsibility & Social Awareness
                    </li>
                    <li>
                    Involvement in National Development
                    </li>
                    <li>
                    Strengthening Community Engagement
                    </li>
                    <li>
                    Disaster Relief and Emergency Response
                    </li>
                    <li>
                    Environmental Conservation
                    </li>
                    <li>
                    Women Empowerment & Gender Equality

                    </li>
                </ol>

                </li>
              
            </ul>


            </div>
            <div className="Objectivesright">
            
            <img src={Aboutimage7} alt="" />;

            </div>
        </div>

      </div>
       
      </>
    )
  }
  
  export default Objectives