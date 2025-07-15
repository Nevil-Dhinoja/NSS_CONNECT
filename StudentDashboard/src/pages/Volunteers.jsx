import "./Voluteers.css";
import { LuUpload } from "react-icons/lu";
import { IoPersonAddOutline } from "react-icons/io5";
import { IoPeopleOutline } from "react-icons/io5";

const Volunteers = () => {
  return (
    <div className="volunteers">
      <div className="title">
        <div className="titleLeft">
          <p>Volunteers Management</p>
        </div>
        <div className="titleRight">
          <button className="btn1" >
            <span>
              <LuUpload />
            </span>{" "}
            Upload Volunteer List
          </button>
          <button className="btn2">
            <span>
              <IoPersonAddOutline />
            </span>{" "}
            Add Single Volunteer
          </button>
        </div>
      </div>

      <div className="volunteersMidBox">
        <div className="volunteersMidTitle">
          <div className="volunteersMidTitleLeft">
            <span>
              <IoPeopleOutline />
            </span>

            <h3>Volunteers List</h3>
          </div>
          <div className="volunteersMidTitleRight">
            
           
          <select name="" id="ConvertInto">
              <option value="">All Departments</option>
              <option value="">2023 - 24</option>
              <option value="">2022 - 23</option>
              <option value="">2021 - 22</option>
            </select>
            <input type="text" placeholder="🔍︎ Search Volunteers..." id="VolunteersSearch" ></input>
            <select name="" id="AllDepartments">
              <option value="">All Departments</option>
              <option value="">2023 - 24</option>
              <option value="">2022 - 23</option>
              <option value="">2021 - 22</option>
            </select>
            
            <select name="" id="AllYears">
              <option value="">All Years</option>
              <option value="">2023 - 24</option>
              <option value="">2022 - 23</option>
              <option value="">2021 - 22</option>
            </select>
          </div>
        </div>
        <div className="volunteersMidBoxMid">
            <div className="detailsTitle">
              <div className="vname">
                Name 
              </div>
              <div className="vid">
                Student ID
              </div>
              <div className="vdepartment">
                Department
              </div>
              <div className="vyear">
                Year
              </div>
              <div className="vcontact">
                Contact
              </div>
              <div className="vjoined">
                Joined On
              </div>
            </div>

            <div className="details">
              <div className="vname1">
              Rajesh Kumar 
              </div>
              <div className="vid1">
              STU101
              </div>
              <div className="vdepartment1">
              Computer Science
              </div>
              <div className="vyear1">
                2023
              </div>
              <div className="vcontact1">
              rajesh@example.com<br/>
              9876543220
              </div>
              <div className="vjoined1">
              15/7/2023
              </div>
            </div>
            <div className="details">
              <div className="vname1">
              Rajesh Kumar 
              </div>
              <div className="vid1">
              STU101
              </div>
              <div className="vdepartment1">
              Computer Science
              </div>
              <div className="vyear1">
                2023
              </div>
              <div className="vcontact1">
              rajesh@example.com<br/>
              9876543220
              </div>
              <div className="vjoined1">
              15/7/2023
              </div>
            </div>
            <div className="details">
              <div className="vname1">
              Rajesh Kumar 
              </div>
              <div className="vid1">
              STU101
              </div>
              <div className="vdepartment1">
              Computer Science
              </div>
              <div className="vyear1">
                2023
              </div>
              <div className="vcontact1">
              rajesh@example.com<br/>
              9876543220
              </div>
              <div className="vjoined1">
              15/7/2023
              </div>
            </div>
            <div className="details">
              <div className="vname1">
              Rajesh Kumar 
              </div>
              <div className="vid1">
              STU101
              </div>
              <div className="vdepartment1">
              Computer Science
              </div>
              <div className="vyear1">
                2023
              </div>
              <div className="vcontact1">
              rajesh@example.com<br/>
              9876543220
              </div>
              <div className="vjoined1">
              15/7/2023
              </div>
            </div>
            <div className="details">
              <div className="vname1">
              Rajesh Kumar 
              </div>
              <div className="vid1">
              STU101
              </div>
              <div className="vdepartment1">
              Computer Science
              </div>
              <div className="vyear1">
                2023
              </div>
              <div className="vcontact1">
              rajesh@example.com<br/>
              9876543220
              </div>
              <div className="vjoined1">
              15/7/2023
              </div>
            </div>
            <div className="details">
              <div className="vname1">
              Rajesh Kumar 
              </div>
              <div className="vid1">
              STU101
              </div>
              <div className="vdepartment1">
              Computer Science
              </div>
              <div className="vyear1">
                2023
              </div>
              <div className="vcontact1">
              rajesh@example.com<br/>
              9876543220
              </div>
              <div className="vjoined1">
              15/7/2023
              </div>
            </div>
            <div className="details">
              <div className="vname1">
              Rajesh Kumar 
              </div>
              <div className="vid1">
              STU101
              </div>
              <div className="vdepartment1">
              Computer Science
              </div>
              <div className="vyear1">
                2023
              </div>
              <div className="vcontact1">
              rajesh@example.com<br/>
              9876543220
              </div>
              <div className="vjoined1">
              15/7/2023
              </div>
            </div>
            <div className="details">
              <div className="vname1">
              Rajesh Kumar 
              </div>
              <div className="vid1">
              STU101
              </div>
              <div className="vdepartment1">
              Computer Science
              </div>
              <div className="vyear1">
                2023
              </div>
              <div className="vcontact1">
              rajesh@example.com<br/>
              9876543220
              </div>
              <div className="vjoined1">
              15/7/2023
              </div>
            </div>
            <div className="details">
              <div className="vname1">
              Rajesh Kumar 
              </div>
              <div className="vid1">
              STU101
              </div>
              <div className="vdepartment1">
              Computer Science
              </div>
              <div className="vyear1">
                2023
              </div>
              <div className="vcontact1">
              rajesh@example.com<br/>
              9876543220
              </div>
              <div className="vjoined1">
              15/7/2023
              </div>
            </div>
            <div className="details">
              <div className="vname1">
              Rajesh Kumar 
              </div>
              <div className="vid1">
              STU101
              </div>
              <div className="vdepartment1">
              Computer Science
              </div>
              <div className="vyear1">
                2023
              </div>
              <div className="vcontact1">
              rajesh@example.com<br/>
              9876543220
              </div>
              <div className="vjoined1">
              15/7/2023
              </div>
            </div>
        </div>

      </div>


    </div>
  );
};

export default Volunteers;
