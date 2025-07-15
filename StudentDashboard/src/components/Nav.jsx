import { Link } from "react-router-dom"
import './Nav.css'
// import { HiOutlineHome } from "react-icons/hi";
import { IoPeopleOutline } from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";
import { FaRegFileAlt } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineEventNote } from "react-icons/md";
import { RiUserLine } from "react-icons/ri";

import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineClipboardDocument,
  HiOutlineUser,
  HiOutlineCog
} from "react-icons/hi2";

const Nav = () => {
  return (
    <div className="nav">

      <div className="navTop">
        <h2>NSS Connect</h2>
      </div>

      <div className="navMid">
        
      <button><Link to="/dashboard"><HiOutlineHome /><span>Dashboard</span></Link></button>
      <button><Link to="/volunteers"><HiOutlineUserGroup /><span>Volunteers</span></Link></button>
      <button><Link to="/events"><HiOutlineCalendar /><span>Events</span></Link></button>
      <button><Link to="/reports"><HiOutlineDocumentText /><span>Reports</span></Link></button>
      <button><Link to="/workingHours"><HiOutlineClipboardDocument /><span>Working Hours</span></Link></button>
      <button><Link to="/profile"><HiOutlineUser /><span>Profile</span></Link></button>
      <button><Link to="/settings"><HiOutlineCog /><span>Settings</span></Link></button>
  
        

      </div>

      <div className="navBottom">
        <p>NSS Conect Portal 2025</p>
      </div>

       
      
    </div>
  )
}

export default Nav
