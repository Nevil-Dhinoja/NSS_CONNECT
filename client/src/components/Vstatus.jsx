import './style.css'
import Aboutimage9 from "../assets/VstatusImg.jpg";



function Vstatus() {
  

    return (
      <>
      

      <div className="VstatusIntro">
        <div className="Vstatustop">
        University NSS Volunteer Status

        </div>
        <div className="Vstatusbottom">
            <div className="Vstatusleft">
    
            <ul>
                <li>
                With an ever-growing number of dedicated volunteers, the CHARUSAT NSS Unit has established itself as a dynamic and impactful student organization. Our strength lies in the commitment of over <b>1600+</b> + active participants who engage in various community-driven activities. The NSS Unit operates under the guidance of Program Coordinator and Officers , ensuring the seamless execution of projects and campaigns.
                </li>
              
            </ul>


            </div>
            <div className="Vstatusright">
            
            <img src={Aboutimage9} alt="" />

            </div>
        </div>

      </div>
       
      </>
    )
  }
  
  export default Vstatus