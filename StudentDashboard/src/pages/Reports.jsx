import "./Reports.css";
import { LuUpload } from "react-icons/lu";
import { IoPersonAddOutline } from "react-icons/io5";
import { IoPeopleOutline } from "react-icons/io5";
import { FiFilter } from 'react-icons/fi';
import { FiDownload } from 'react-icons/fi';

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

const Reports = () => {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="reports">
      <div className="repotstitle">
        <div className="repotstitleLeft">
          <p>Reports Management</p>
        </div>
        <div className="repotstitleRight">
          <button className="reportbtn1">
            <span>
              <FiDownload />
            </span>{" "}
            Generate Summary Report
          </button>
        </div>
      </div>

      <div className="repotsMidBox">
        <div className="repotsMidTitle">
          <div className="repotsMidTitleLeft">
            <div className="reporttabs">
              <button
                onClick={() => setActiveTab("account")}
                className={activeTab === "account" ? "active" : ""}
                id="ebtn1"
              >
                Approved Reports
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={activeTab === "notifications" ? "active" : ""}
                id="ebtn2"
              >
                Pending Reports
              </button>
              
            </div>
          </div>
          <div className="reportsMidTitleRight">
            

          <button name="" id="reportsConvertInto">
              <FiFilter/>
            </button>

            <select name="" id="AllDepartments">
              <option value="">Report Type</option>
              <option value="">All Types</option>
              <option value="">Event</option>
              <option value="">Working Hours</option>
              <option value="">Volunteer</option>
              <option value="">Annual</option>
            </select>

            

            <input
              type="text"
              placeholder="🔍︎ Search reports..."
              id="reportsSearch"
            ></input>
            
          </div>
        </div>

        <div className="eventtab-content">
          {activeTab === "account" && (
            <div>

            <div className="eventsection">
              <div className="reportSectionLeft">
                <div className="eventSectionLeftTitle">
                  <div className="eventSectionLeftTitleLeft">
                    <p>Tree Plantation Drive</p>
                  </div>
                  <div className="eventSectionLeftTitleRight">
                    <button>Upcoming</button>
                    <button className="reporttype">Event</button>
                  </div>
                </div>
                <div className="eventSectionLeftBody">
                  <p><HiOutlineCalendar size={17}/> 20/5/2023</p>
                  <p>Department: University-wide</p>
                  <p>Mode: Offline</p>
                  <p>Scheme: Green Campus Initiative</p>

                </div>
                
                </div>
              <div className="reportSectionRight">
                
                <div className="reportSectionRightBottom">

                  <button className="reportEdit"><HiOutlineDocumentText size={17} /> View Report</button>
                  <button className="reportDetails"><FiDownload size={17}/> Download</button>

                </div>

              </div>
              
            </div>
            <div className="eventsection">
              <div className="reportSectionLeft">
                <div className="eventSectionLeftTitle">
                  <div className="eventSectionLeftTitleLeft">
                    <p>Tree Plantation Drive</p>
                  </div>
                  <div className="eventSectionLeftTitleRight">
                    <button>Upcoming</button>
                    <button className="reporttype">Event</button>
                  </div>
                </div>
                <div className="eventSectionLeftBody">
                  <p><HiOutlineCalendar size={17}/> 20/5/2023</p>
                  <p>Department: University-wide</p>
                  <p>Mode: Offline</p>
                  <p>Scheme: Green Campus Initiative</p>

                </div>
                
                </div>
              <div className="reportSectionRight">
                
                <div className="reportSectionRightBottom">

                  <button className="reportEdit"><HiOutlineDocumentText size={17} /> View Report</button>
                  <button className="reportDetails"><FiDownload size={17}/> Download</button>

                </div>

              </div>
              
            </div>
            <div className="eventsection">
              <div className="reportSectionLeft">
                <div className="eventSectionLeftTitle">
                  <div className="eventSectionLeftTitleLeft">
                    <p>Tree Plantation Drive</p>
                  </div>
                  <div className="eventSectionLeftTitleRight">
                    <button>Upcoming</button>
                    <button className="reporttype">Event</button>
                  </div>
                </div>
                <div className="eventSectionLeftBody">
                  <p><HiOutlineCalendar size={17}/> 20/5/2023</p>
                  <p>Department: University-wide</p>
                  <p>Mode: Offline</p>
                  <p>Scheme: Green Campus Initiative</p>

                </div>
                
                </div>
              <div className="reportSectionRight">
                
                <div className="reportSectionRightBottom">

                  <button className="reportEdit"><HiOutlineDocumentText size={17} /> View Report</button>
                  <button className="reportDetails"><FiDownload size={17}/> Download</button>

                </div>

              </div>
              
            </div>
            <div className="eventsection">
              <div className="reportSectionLeft">
                <div className="eventSectionLeftTitle">
                  <div className="eventSectionLeftTitleLeft">
                    <p>Tree Plantation Drive</p>
                  </div>
                  <div className="eventSectionLeftTitleRight">
                    <button>Upcoming</button>
                    <button className="reporttype">Event</button>
                  </div>
                </div>
                <div className="eventSectionLeftBody">
                  <p><HiOutlineCalendar size={17}/> 20/5/2023</p>
                  <p>Department: University-wide</p>
                  <p>Mode: Offline</p>
                  <p>Scheme: Green Campus Initiative</p>

                </div>
                
                </div>
              <div className="reportSectionRight">
                
                <div className="reportSectionRightBottom">

                  <button className="reportEdit"><HiOutlineDocumentText size={17} /> View Report</button>
                  <button className="reportDetails"><FiDownload size={17}/> Download</button>

                </div>

              </div>
              
            </div>
            
            </div>


          )}

          {activeTab === "notifications" && (
             <div>
              <div className="eventsection">
              <div className="reportSectionLeft">
                <div className="eventSectionLeftTitle">
                  <div className="eventSectionLeftTitleLeft">
                    <p>Tree Plantation Drive</p>
                  </div>
                  <div className="eventSectionLeftTitleRight">
                    <button className="pending">Pending</button>
                    <button className="reporttype">Annual</button>
                  </div>
                </div>
                <div className="eventSectionLeftBody">
                  <p><HiOutlineCalendar size={17}/> 20/5/2023</p>
                  <p>Department: University-wide</p>
                  <p>Mode: Offline</p>
                  <p>Scheme: Green Campus Initiative</p>

                </div>
                
                </div>
              <div className="reportSectionRight">
                
                <div className="reportSectionRightBottom">

                
                  <button className="reportDetails"><HiOutlineDocumentText size={17} /> Review</button>

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

export default Reports;

