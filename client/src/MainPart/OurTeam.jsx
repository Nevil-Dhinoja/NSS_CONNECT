import "../components/style.css";
import image1 from "../assets/VstatusImg.jpg";
import image2 from "../assets/cordi4.jpeg";
import image3 from "../assets/Event1.jpg";
// import "./MianPart.css";
import Footer from "../components/Footer";


import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { useRef } from "react";

import i1 from "../assets/Ankur Patel_CSPIT EE.jpg";
import i2 from "../assets/Dr. Martin Parmar_CSPIT-CE.jpg";
import i3 from "../assets/Dr. Hardik B. Pandit_CMPICA.jpg";
import i4 from "../assets/Dr. Poonam Amrutia_IIIM.jpg";
import i5 from "../assets/Dr. Rajesh V. Savalia_ Maths Department_ PDPIAS.jpg";
import i6 from "../assets/Dr. Sagarkumar B. Patel_CSPIT- EC.jpg";
import i7 from "../assets/Dr. Shreya Swami (PT)_ ARIP.jpg";
import i8 from "../assets/Gaurang Patel.jpg";
import i9 from "../assets/Gauravkumar.jpg";
import i10 from "../assets/Hardik Koria_RPCP.jpg";
import i11 from "../assets/hetal passport size photo.jpg";
import i12 from "../assets/Hitesh Makwana_DEPSTAR-IT.png";
import i13 from "../assets/Kashyap Patel - DEPSTAR - CE.jpg";
import i14 from "../assets/Megha Desai_CSPIT_CL.jpg";
import i15 from "../assets/Parth Thakor_BDIPS.jpg";
import i16 from "../assets/Pinal Hansora_CSPIT-CSE.jpg";
import i17 from "../assets/Rajnik Katriya- CSPIT-IT.jpg";
import i18 from "../assets/Satayu Travadi -CSPIT ME.jpg";


import im1 from "../assets/Dhruv EC.png";
import im2 from "../assets/Diya.png";
import im3 from "../assets/AARTI.png";
import im4 from "../assets/JASH.png";
import im5 from "../assets/Heet.jpg";
import im6 from "../assets/Chesta.jpg";
import im7 from "../assets/Utsav.jpg";
import im8 from "../assets/PARV.png";
// import im9 from "../assets/PARV.png";






const testimonials = [
  {
    image: image2,
    text: "I am happy to know that CHARUSAT has a goal set for the mission of social upliftment.",
    name: "Prof. Kishan Patel",
    designation:
      "NSS Program Coordinator , CHARUSAT",
  },
];

const coordinators = [
  {
    name: "Mr. Dhruv Pupapara",
    role: "CSPIT-EC",
    image: im1,
  },
  {
    name: "Ms. Diya Thakkar",
    role: "CSPIT-EC",
    image: im2,
  },

  {
    name: "Ms. Aarti Jain",
    role: "CSPIT-CE",
    image: im3,
  },
  {
    name: "Mr. Jash Bhungaliya",
    role: "CSPIT-ME",
    image: im4,
  },
  {
    name: "Mr. Heet Vithalani",
    role: "DEPSTAR-CE",
    image: im5,
  },
  {
    name: "Ms. Chesta Ginoya",
    role: "DEPSTAR-CE",
    image: im6,
  },
    {
    name: "Mr. Utsav Lodaliya",
    role: "CMPICA",
    image: im7,
  },
    {
    name: "Mr. Parv Chittora",
    role: "PDPIAS",
    image: im8,
  },

 
  // {
  //   name: "Ms. Saloni Patel",
  //   role: "ARIP",
  //   image: im3,
  // },
  // {
  //   name: "Mr. Arya Kayastha",
  //   role: "CSPIT-CE",
  //   image: im3,
  // },
  // {
  //   name: "Mr. Jay Rohit",
  //   role: "ARIP",
  //   image: im4,
  // },

  // {
  //   name: "Mr. Nemish Sapara",
  //   role: "CSPIT-AIML",
  //   image: im6,
  // },
  // {
  //   name: "Mr. Kaushal Savaliya",
  //   role: "CSPIT-AIML",
  //   image: im1,
  // },
  // {
  //   name: "Mr. Dhruv Prajapati",
  //   role: "CSPIT-IT",
  //   image: im2,
  // },
  // {
  //   name: "Ms. Soha Vohra",
  //   role: "CSPIT-Civil",
  //   image: im3,
  // },
  // {
  //   name: "Ms. Yashvi Patel",
  //   role: "DEPSTAR-CE",
  //   image: im4,
  // },
  // {
  //   name: "Ms. Diya Thakkar",
  //   role: "CSPIT-EC",
  //   image: im5,
  // },

  // {
  //   name: "Ms. Nency Patel",
  //   role: "BDIPS",
  //   image: im1,
  // },
  // {
  //   name: "Mr. Prem Koradiya",
  //   role: "BDIPS",
  //   image: im2,
  // },
  // {
  //   name: "Mr. Maharshi Patel",
  //   role: "DEPSTAR-CE",
  //   image: im3,
  // },
  // {
  //   name: "Ms. Parin Desai",
  //   role: "CSPIT-EE",
  //   image: im4,
  // },
  // {
  //   name: "Ms. Bansi Kanani",
  //   role: "DEPSTAR-IT",
  //   image: im5,
  // },
  // {
  //   name: "Mr. Dhruvin Mangukiya",
  //   role: "DEPSTAR-CSE",
  //   image: im6,
  // },
  // {
  //   name: "Mr. Preet Chauhan",
  //   role: "DEPSTAR-IT",
  //   image: im1,
  // },
  // {
  //   name: "Mr. Mayur Maheshwari",
  //   role: "MTIN",
  //   image: im2,
  // },
  // {
  //   name: "Ms. Bansari Patel",
  //   role: "CSMPICA",
  //   image: im3,
  // },
  // {
  //   name: "Mr. Jayraj Rathod",
  //   role: "CSPIT-ME",
  //   image: im4,
  // },

  // {
  //   name: "Ms. Keshar Patel",
  //   role: "PDPIS",
  //   image: im6,
  // },
  // {
  //   name: "Ms. Yukti Goyani",
  //   role: "CSPIT-EE",
  //   image: im1,
  // },
  // {
  //   name: "Mr. Darsh Patel",
  //   role: "CSPIT-CSE",
  //   image: im2,
  // },
  // {
  //   name: "Mr. Manan Monani",
  //   role: "DEPSTAR-CSE",
  //   image: im3,
  // },
  // {
  //   name: "Ms. Azba Vohra",
  //   role: "CSPIT-Civil",
  //   image: im4,
  // },
  // {
  //   name: "Ms. Ridhdhi Ramanuj",
  //   role: "CSPIT-CE",
  //   image: im5,
  // },
  // {
  //   name: "Ms. Disha Shah",
  //   role: "CSPIT-IT",
  //   image: im6,
  // },
  // {
  //   name: "Ms. Dhruvi Mahale",
  //   role: "CSPIT-CSE",
  //   image: im6,
  // },
  // Add more coordinators here
];

function OurTeam() {
  const sliderRef = useRef(null);

  const scrollAmount = 6 * 120; // Approx width of 6 SCPhoto items

  const Pre = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const Next = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  return (
    <>
      <div className="OurTeam">Our Team</div>

      <div className="Coordinator">
        <div className="AboutUs Pcordi" style={{marginTop:"5px"}}>
          Program Coordinator
        </div>
      </div>
      
      <div className="Statistics">
        <div className="flex justify-center items-center bg-gray-100">
          <div
            className="w-full max-w-2xl p-5"
            style={{ width: "100%", borderRadius: "10px",textAlign:"center"}}
          >
            <Swiper>
              {testimonials.map((testimonial, index) => (
                <SwiperSlide
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-md mb-4 program-coordinator-image"
                    style={{
                      borderRadius: "20px",
                      height: "250px",
                      width: "200px",
                      marginTop: "30px",
                    }}
                  />

                  <h5 className="font-semibold text-gray-900 mt-0">
                    {testimonial.name}
                  </h5>
                  <p
                    className="text-gray-500 text-sm"
                    style={{ fontSize: "15px" }}
                  >
                    {testimonial.designation}
                  </p>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      <div className="Coordinators">
      <div className="AboutUs Pcordi" style={{marginTop:"5px"}}>
      Program Officers
      </div>
        

        <div className="Sub">
          <div className="CPhoto">
            <div className="C1">
              <img src={i1} alt="" />
            </div>
            <div className="C2">
              <p className="p1">Prof. Ankur Patel</p>
         
              <p className="p3">CSPIT-EE</p>
            </div>
          </div>
          <div className="CPhoto">
            <div className="C1">
              <img src={i3} alt="" />
            </div>
            <div className="C2">
              <p className="p1">Dr. Hardik Pandit</p>
              
              <p className="p3">CMPICA</p>
            </div>
          </div>
          <div className="CPhoto">
            <div className="C1">
              <img src={i2} alt="" />
            </div>
            <div className="C2">
              <p className="p1">Prof. Martin Parmar</p>
         
              <p className="p3">CSPIT-CE</p>
            </div>
          </div>
          <div className="CPhoto">
            <div className="C1">
              <img src={i4} alt="" />
            </div>
            <div className="C2">
              <p className="p1">Dr. Poonam Amrutia</p>
              
              <p className="p3">IIIM</p>
            </div>
          </div>
          <div className="CPhoto">
            <div className="C1">
              <img src={i5} alt="" />
            </div>
            <div className="C2">
              <p className="p1">Dr. Rajesh Savalia</p>
          
              <p className="p3">PDPIAS</p>
            </div>
          </div>
          <div className="CPhoto">
            <div className="C1">
              <img src={i6} alt="" />
            </div>
            <div className="C2">
              <p className="p1">Dr. Sagarkumar Patel</p>
              
              <p className="p3">CSPIT-EC</p>
            </div>
          </div>
          <div className="CPhoto">
            <div className="C1">
              <img src={i7} alt="" />
            </div>
            <div className="C2">
              <p className="p1">Dr. Shreya Swami</p>
             
              <p className="p3">ARIP</p>
            </div>
          </div>
          <div className="CPhoto">
            <div className="C1">
              <img src={i8} alt="" />
            </div>
            <div className="C2">
              <p className="p1">Prof. Gaurang Patel</p>
          
              <p className="p3">DEPSTAR-CSE</p>
            </div>
          </div>
          <div className="CPhoto">
            <div className="C1">
              <img src={i9} alt="" />
            </div>
            <div className="C2">
              <p className="p1">Prof. Gauravkumar</p>
          
              <p className="p3">CSPIT-AIML</p>
            </div>
          </div>
          <div className="CPhoto">
            <div className="C1">
              <img src={i10} alt="" />
            </div>
            <div className="C2">
              <p className="p1">Prof. Hardik Koria</p>
          
              <p className="p3">RPCP</p>
            </div>
          </div>
          <div className="CPhoto">
            <div className="C1">
              <img src={i11} alt="" />
            </div>
            <div className="C2">
            
            <p className="p1">Prof. Hetal Shah</p>
              <p className="p3">IIIM</p>
            </div>
          </div>
          <div className="CPhoto">
            <div className="C1">
              <img src={i12} alt="" />
            </div>
            <div className="C2">
              <p className="p1">Prof. Hitesh Makwana</p>
            
              <p className="p3">DEPSTAR-IT</p>
            </div>
          </div>
          <div className="CPhoto">
            <div className="C1">
              <img src={i13} alt="" />
            </div>
            <div className="C2">
              <p className="p1">Prof. Kashyap Patel</p>
              
              <p className="p3">DEPSTAR-CE</p>
            </div>
          </div>
          <div className="CPhoto">
            <div className="C1">
              <img src={i14} alt="" />
            </div>
            <div className="C2">
              <p className="p1">Prof. Megha Desai</p>
              
              <p className="p3">CSPIT-CL</p>
            </div>
          </div>
          <div className="CPhoto">
            <div className="C1">
              <img src={i16} alt="" />
            </div>
            <div className="C2">
              <p className="p1">Prof. Pinal Hansora</p>
             
              <p className="p3">CSPIT-CSE</p>
            </div>
          </div>
          <div className="CPhoto">
            <div className="C1">
              <img src={i17} alt="" />
            </div>
            <div className="C2">
              <p className="p1">Prof. Rajnik Katriya</p>
              
              <p className="p3">CSPIT-IT</p>
            </div>
          </div>
          <div className="CPhoto">
            <div className="C1">
              <img src={i18} alt="" />
            </div>
            <div className="C2">
              <p className="p1">Prof. Satayu Travadi</p>
           
              <p className="p3">CSPIT-ME</p>
            </div>
          </div>
          <div className="CPhoto">
            <div className="C1">
              <img src={i15} alt="" />
            </div>
            <div className="C2">
              <p className="p1">Prof. Parth Thakor</p>
           
              <p className="p3">BDIPS</p>
            </div>
          </div>
          
          
          
        </div>
      </div>

      <div className="StudentCoordinator">
      <div className="AboutUs Pcordi">
        Student Coordinators
      </div>

      {/* Scrollable SCPhotos */}
      <div
        ref={sliderRef}
        className="SSub flex overflow-x-auto scroll-smooth scrollbar-hide gap-2 p-2"
      >
        {coordinators.map((coordinator, index) => (
          <div
            key={index}
            className="SCPhoto bg-gray-200 w-28 h-28 rounded-md flex flex-col items-center p-2"
            
          >
            <center><div className="S1">
            <center><img
                src={coordinator.image}
                alt={coordinator.name}
                className="w-24 h-24 rounded-full object-cover"
                
              /></center>
              
            </div></center>
            <div className="S2 text-center mt-2">
              <p className="p1 font-bold">{coordinator.name}</p>
              <p className="p2 text-sm text-gray-600">{coordinator.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {/* <nav
        aria-label="Page navigation example"
        className="mt-4 flex justify-center"
        style={{ marginLeft: "170px" }}
      >
        <ul className="pagination flex gap-2">
          <li className="page-item">
            <button
              className="page-link bg-gray-200 p-2 rounded-md"
              aria-label="Previous"
              onClick={Pre}
            >
              &laquo;
            </button>
          </li>
          <li className="page-item">
            <button
              className="page-link bg-gray-200 p-2 rounded-md"
              aria-label="Next"
              onClick={Next}
            >
              &raquo;
            </button>
          </li>
        </ul>
      </nav> */}
    </div>

      <div className="f1" style={{ marginTop: "130px", width: "100%" }}>
        <div
          className="AboutUs"
          style={{ flexDirection: "column", height: "80px" }}
        >
          Join NSS, Be the Change!
          <p style={{ fontSize: "10px", fontWeight: "500" }}>
            If you are passionate about making a difference, become a part of
            our NSS family today and contribute to a better, brighter future!
          </p>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
}

export default OurTeam;