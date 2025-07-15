import './style.css'
import image1 from "../assets/Motoo.png";



function Motto() {
  

    return (
      <>


      <div className="MottoIntro">
        <div className="Mottotop">
        Motto: "Not Me, But You"

        </div>
        <div className="Mottobottom">
            <div className="Mottoleft">
            <img src={image1} alt="" />

    
          


            </div>
            <div className="Mottoright">
            

            <ul>
                <li>
                The motto of the National Service Scheme (NSS) is "Not Me, But You," which reflects the essence of selfless service, community welfare, and national integration.
               <ul>
               <li>
                It signifies that the needs of the society should always come before personal interests.
                </li>
                <li>
                The motto promotes the idea that every individual has a responsibility towards the well-being of others.
                </li>
                <li>
                It aims to develop a sense of social responsibility and volunteerism among students.
                </li>
               </ul>

                </li>
                <li>
                By embracing this motto, NSS volunteers at CHARUSAT work towards building a compassionate and progressive society, driven by unity, integrity, and service.
                </li>
            </ul>

            </div>
        </div>

      </div>
       
      </>
    )
  }
  
  export default Motto