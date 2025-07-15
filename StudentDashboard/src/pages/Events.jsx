import "./Events.css";
import { LuUpload } from "react-icons/lu";
import { IoPersonAddOutline } from "react-icons/io5";
import { IoPeopleOutline } from "react-icons/io5";
import { FiPlus } from 'react-icons/fi';

import React, { useState } from "react";

import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineClipboardDocument,
  HiOutlineUser,
  HiOutlineCog
} from "react-icons/hi2";

const Events = () => {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="events">
      <div className="eventtitle">
        <div className="eventtitleLeft">
          <p>Events Management</p>
        </div>
        <div className="eventtitleRight">
          <button className="eventbtn1">
            <span>
              <FiPlus />
            </span>{" "}
            Add New Event
          </button>
        </div>
      </div>

      <div className="eventsMidBox">
        <div className="eventsMidTitle">
          <div className="eventsMidTitleLeft">
            <div className="eventtabs">
              <button
                onClick={() => setActiveTab("account")}
                className={activeTab === "account" ? "active" : ""}
                id="ebtn1"
              >
                Upcoming Events
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={activeTab === "notifications" ? "active" : ""}
                id="ebtn2"
              >
                Completed Events
              </button>
              
            </div>
          </div>
          <div className="eventsMidTitleRight">
            <input
              type="text"
              placeholder="🔍︎ Search Volunteers..."
              id="eventsSearch"
            ></input>
            <select name="" id="eventsConvertInto">
              <option value="">All Departments</option>
              <option value="">2023 - 24</option>
              <option value="">2022 - 23</option>
              <option value="">2021 - 22</option>
            </select>
          </div>
        </div>

        <div className="eventtab-content">
          {activeTab === "account" && (
            <div>

            <div className="eventsection">
              <div className="eventSectionLeft">
                <div className="eventSectionLeftTitle">
                  <div className="eventSectionLeftTitleLeft">
                    <p>Tree Plantation Drive</p>
                  </div>
                  <div className="eventSectionLeftTitleRight">
                    <button>Upcoming</button>
                  </div>
                </div>
                <div className="eventSectionLeftBody">
                  <p><HiOutlineCalendar /> 20/5/2023</p>
                  <p>Department: University-wide</p>
                  <p>Mode: Offline</p>
                  <p>Scheme: Green Campus Initiative</p>

                </div>
                
                </div>
              <div className="eventSectionRight">
                <div className="eventSectionRightTop">
                  <div className="eventSectionRightTopTitle">
                    <p>Participation</p>
                  </div>
                  <div className="eventSectionRightTopBody">
                    <div className="faculties">
                      <h6>8</h6>
                      <p>Faculties</p>
                    </div>
                    <div className="students">
                    <h6>75</h6>
                    <p>Students</p>

                    </div>
                    <div className="beneficiaries">
                    <h6>200</h6>
                    <p>Beneficiaries</p>

                    </div>
                  </div>
                </div>
                <div className="eventSectionRightBottom">

                  <button className="Edit">Edit</button>
                  <button className="Details">Details</button>

                </div>

              </div>
              
            </div>
            <div className="eventsection">
              <div className="eventSectionLeft">
                <div className="eventSectionLeftTitle">
                  <div className="eventSectionLeftTitleLeft">
                    <p>Digital Literacy Workshop
                    </p>
                  </div>
                  <div className="eventSectionLeftTitleRight">
                    <button>Upcoming</button>
                  </div>
                </div>
                <div className="eventSectionLeftBody">
                  <p><HiOutlineCalendar /> 25/5/2023</p>
                  <p>Department: Computer Science</p>
                  <p>Mode: Hybrid</p>
                  <p>Scheme: Digital India</p>

                </div>
                
                </div>
              <div className="eventSectionRight">
                <div className="eventSectionRightTop">
                  <div className="eventSectionRightTopTitle">
                    <p>Participation</p>
                  </div>
                  <div className="eventSectionRightTopBody">
                    <div className="faculties">
                      <h6>4</h6>
                      <p>Faculties</p>
                    </div>
                    <div className="students">
                    <h6>40</h6>
                    <p>Students</p>

                    </div>
                    <div className="beneficiaries">
                    <h6>120</h6>
                    <p>Beneficiaries</p>

                    </div>
                  </div>
                </div>
                <div className="eventSectionRightBottom">

                  <button className="Edit">Edit</button>
                  <button className="Details">Details</button>

                </div>

              </div>
              
            </div>
            </div>


          )}

          {activeTab === "notifications" && (
             <div>

             <div className="eventsection">
               <div className="eventSectionLeft">
                 <div className="eventSectionLeftTitle">
                   <div className="eventSectionLeftTitleLeft">
                     <p>Blood Donation Camp</p>
                   </div>
                   <div className="eventSectionLeftTitleRight">
                     <button className="completed">Completed</button>
                     <button className="reportSubmited">Report Submited</button>
                   </div>
                 </div>
                 <div className="eventSectionLeftBody">
                   <p><HiOutlineCalendar /> 5/5/2023</p>
                   <p>Department: University-wide</p>
                   <p>Mode: Offline</p>
                   <p>Scheme: Healthcare Initiative</p>
 
                 </div>
                 
                 </div>
               <div className="eventSectionRight">
                 <div className="eventSectionRightTop">
                   <div className="eventSectionRightTopTitle">
                     <p>Participation</p>
                   </div>
                   <div className="eventSectionRightTopBody">
                     <div className="faculties">
                       <h6>8</h6>
                       <p>Faculties</p>
                     </div>
                     <div className="students">
                     <h6>75</h6>
                     <p>Students</p>
 
                     </div>
                     <div className="beneficiaries">
                     <h6>200</h6>
                     <p>Beneficiaries</p>
 
                     </div>
                   </div>
                 </div>
                 <div className="eventSectionRightBottom">
 
                   <button className="eventEdit1">View Report</button>
                   <button className="eventEdit2"><HiOutlineDocumentText size={17} /> View Report</button>
 
                 </div>
 
               </div>
               
             </div>
             <div className="eventsection">
               <div className="eventSectionLeft">
                 <div className="eventSectionLeftTitle">
                   <div className="eventSectionLeftTitleLeft">
                     <p>Blood Donation Camp</p>
                   </div>
                   <div className="eventSectionLeftTitleRight">
                     <button className="completed">Completed</button>
                     <button className="reportSubmited">Report Submited</button>
                   </div>
                 </div>
                 <div className="eventSectionLeftBody">
                   <p><HiOutlineCalendar /> 5/5/2023</p>
                   <p>Department: University-wide</p>
                   <p>Mode: Offline</p>
                   <p>Scheme: Healthcare Initiative</p>
 
                 </div>
                 
                 </div>
               <div className="eventSectionRight">
                 <div className="eventSectionRightTop">
                   <div className="eventSectionRightTopTitle">
                     <p>Participation</p>
                   </div>
                   <div className="eventSectionRightTopBody">
                     <div className="faculties">
                       <h6>8</h6>
                       <p>Faculties</p>
                     </div>
                     <div className="students">
                     <h6>75</h6>
                     <p>Students</p>
 
                     </div>
                     <div className="beneficiaries">
                     <h6>200</h6>
                     <p>Beneficiaries</p>
 
                     </div>
                   </div>
                 </div>
                 <div className="eventSectionRightBottom">
 
                   <button className="eventEdit1">View Report</button>
                   <button className="eventEdit2"><HiOutlineDocumentText size={17} /> View Report</button>
 
                 </div>
 
               </div>
               
             </div>
             <div className="eventsection">
               <div className="eventSectionLeft">
                 <div className="eventSectionLeftTitle">
                   <div className="eventSectionLeftTitleLeft">
                     <p>Blood Donation Camp</p>
                   </div>
                   <div className="eventSectionLeftTitleRight">
                     <button className="completed">Completed</button>
                     <button className="reportSubmited">Report Submited</button>
                   </div>
                 </div>
                 <div className="eventSectionLeftBody">
                   <p><HiOutlineCalendar /> 5/5/2023</p>
                   <p>Department: University-wide</p>
                   <p>Mode: Offline</p>
                   <p>Scheme: Healthcare Initiative</p>
 
                 </div>
                 
                 </div>
               <div className="eventSectionRight">
                 <div className="eventSectionRightTop">
                   <div className="eventSectionRightTopTitle">
                     <p>Participation</p>
                   </div>
                   <div className="eventSectionRightTopBody">
                     <div className="faculties">
                       <h6>8</h6>
                       <p>Faculties</p>
                     </div>
                     <div className="students">
                     <h6>75</h6>
                     <p>Students</p>
 
                     </div>
                     <div className="beneficiaries">
                     <h6>200</h6>
                     <p>Beneficiaries</p>
 
                     </div>
                   </div>
                 </div>
                 <div className="eventSectionRightBottom">
 
                   <button className="eventEdit1">View Report</button>
                   <button className="eventEdit2"><HiOutlineDocumentText size={17} /> View Report</button>
 
                 </div>
 
               </div>
               
             </div>
             
               
             
             
               
             
             </div>
          )}

          
        </div>
      </div>
    </div>
  );
};

export default Events;
