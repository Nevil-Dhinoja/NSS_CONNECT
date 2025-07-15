import './Header.css'
import { RiMenuFold3Fill } from "react-icons/ri";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FiColumns } from "react-icons/fi";

const Header = () => {
  return (
    <div className='header'>

        <div className="headerLeft">

            <div className="iconText">
            <FiColumns/>
            <span><h2 style={{fontWeight:"600"}}>NSS Connect Dashboard</h2></span>
            </div>
           

        </div>
        <div className="headerRight">
        
            <div className="box1">
                    <IoIosNotificationsOutline/>
            </div>
            <div className="box2">
                <div className="subBox2">
                  D
                </div>
                <p>Dhruv Rupapara</p>  
            </div>
        </div>
      
    </div>
  )
}

export default Header
