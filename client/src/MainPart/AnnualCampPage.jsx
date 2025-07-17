import "../components/style.css";
import image1 from "../assets/Event2.jpg";
import image2 from "../assets/Event3.jpg";
import image3 from "../assets/Event4.jpg";
import image4 from "../assets/Event5.jpg";
import image5 from "../assets/Event6.jpg";
import "./MianPart.css";
import Footer from "../components/Footer";

import React, { useRef } from "react";

const coordinators = [
  {
    image: image5,
  },
  {
    image: image2,
  },
  {
    image: image3,
  },
  
  {
    image: image4,
  },
  
  {
    image: image1,
  },
  // Add more images as needed
];

function AnnualCampPage() {

  const sliderRef = useRef(null);

  const Pre = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const Next = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };


  return (
    <>
      <div className="AboutUs">Annual Camp</div>


      <div className="Acamp" style={{marginTop:"0px"}}>
        {/* <h4
          className="text-center text-xl font-semibold text-gray-800 mb-6"
          style={{ color: "#0765a5", marginTop: "-50px" }}
        >
          Student Coordinators
        </h4> */}
        <div className="yearheading" style={{marginBottom:"0px"}}>
        A.Y 2025-24 : Polo Forest 
        </div>

        {/* Scrollable SCPhotos */}
        <div
          ref={sliderRef}
          className="CSub flex overflow-x-auto scroll-smooth scrollbar-hide gap-4 p-2"
        >
           {coordinators.map((coordinator, index) => (
          <div
            key={index}
            className="CCPhoto bg-gray-200 w-28 h-28 rounded-md"
                
          >
            
              <img
                src={coordinator.image}
                alt={`Coordinator ${index + 1}`}
                className="w-24 h-24 rounded-full object-cover"
               
              />
            
          </div>
        ))}
        </div>

        {/* Pagination Controls */}
        <nav
          aria-label="Page navigation example"
          className="mt-0 flex justify-center AnnualNav"
         
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
            {/* <li className="page-item"><a className="page-link" href="#">1</a></li>
          <li className="page-item"><a className="page-link" href="#">2</a></li>
          <li className="page-item"><a className="page-link" href="#">3</a></li> */}
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
        </nav>
      </div>
      <div className="Acamp">
        {/* <h4
          className="text-center text-xl font-semibold text-gray-800 mb-6"
          style={{ color: "#0765a5", marginTop: "-50px" }}
        >
          Student Coordinators
        </h4> */}
        <div className="yearheading" style={{marginBottom:"0px"}}>
        A.Y 2025-24 : Polo Forest 
        </div>

        {/* Scrollable SCPhotos */}
        <div
          ref={sliderRef}
          className="CSub flex overflow-x-auto scroll-smooth scrollbar-hide gap-4 p-2"
        
        >
           {coordinators.map((coordinator, index) => (
          <div
            key={index}
            className="CCPhoto bg-gray-200 w-28 h-28 rounded-md"
               
          >
            
              <img
                src={coordinator.image}
                alt={`Coordinator ${index + 1}`}
                className="w-24 h-24 rounded-full object-cover"

              />
            
          </div>
        ))}
        </div>

        {/* Pagination Controls */}
        <nav
          aria-label="Page navigation example"
          className="mt-0 flex justify-center AnnualNav"
         
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
            {/* <li className="page-item"><a className="page-link" href="#">1</a></li>
          <li className="page-item"><a className="page-link" href="#">2</a></li>
          <li className="page-item"><a className="page-link" href="#">3</a></li> */}
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
        </nav>
      </div>
      <div className="Acamp" >
        {/* <h4
          className="text-center text-xl font-semibold text-gray-800 mb-6"
          style={{ color: "#0765a5", marginTop: "-50px" }}
        >
          Student Coordinators
        </h4> */}
        <div className="yearheading" style={{marginBottom:"0px"}}>
        A.Y 2025-24 : Polo Forest 
        </div>

        {/* Scrollable SCPhotos */}
        <div
          ref={sliderRef}
          className="CSub flex overflow-x-auto scroll-smooth scrollbar-hide gap-4 p-2"
        >
           {coordinators.map((coordinator, index) => (
          <div
            key={index}
            className="CCPhoto bg-gray-200 w-28 h-28 rounded-md"
            
          >
            
              <img
                src={coordinator.image}
                alt={`Coordinator ${index + 1}`}
                className="w-24 h-24 rounded-full object-cover"
           
              />
            
          </div>
        ))}
        </div>

        {/* Pagination Controls */}
        <nav
          aria-label="Page navigation example"
          className="mt-0 flex justify-center AnnualNav"
          
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
            {/* <li className="page-item"><a className="page-link" href="#">1</a></li>
          <li className="page-item"><a className="page-link" href="#">2</a></li>
          <li className="page-item"><a className="page-link" href="#">3</a></li> */}
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
        </nav>
      </div>
      <div className="Acamp">
        {/* <h4
          className="text-center text-xl font-semibold text-gray-800 mb-6"
          style={{ color: "#0765a5", marginTop: "-50px" }}
        >
          Student Coordinators
        </h4> */}
        <div className="yearheading" style={{marginBottom:"0px"}}>
        A.Y 2025-24 : Polo Forest 
        </div>

        {/* Scrollable SCPhotos */}
        <div
          ref={sliderRef}
          className="CSub flex overflow-x-auto scroll-smooth scrollbar-hide gap-4 p-2"
        >
           {coordinators.map((coordinator, index) => (
          <div
            key={index}
            className="CCPhoto bg-gray-200 w-28 h-28 rounded-md"
           
          >
            
              <img
                src={coordinator.image}
                alt={`Coordinator ${index + 1}`}
                className="w-24 h-24 rounded-full object-cover"
         
              />
            
          </div>
        ))}
        </div>

        {/* Pagination Controls */}
        <nav
          aria-label="Page navigation example"
          className="mt-0 flex justify-center AnnualNav"
       
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
            {/* <li className="page-item"><a className="page-link" href="#">1</a></li>
          <li className="page-item"><a className="page-link" href="#">2</a></li>
          <li className="page-item"><a className="page-link" href="#">3</a></li> */}
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
        </nav>
      </div>
      <div className="Acamp" >
        {/* <h4
          className="text-center text-xl font-semibold text-gray-800 mb-6"
          style={{ color: "#0765a5", marginTop: "-50px" }}
        >
          Student Coordinators
        </h4> */}
        <div className="yearheading" style={{marginBottom:"0px"}}>
        A.Y 2025-24 : Polo Forest 
        </div>

        {/* Scrollable SCPhotos */}
        <div
          ref={sliderRef}
          className="CSub flex overflow-x-auto scroll-smooth scrollbar-hide gap-4 p-2"
          
        >
           {coordinators.map((coordinator, index) => (
          <div
            key={index}
            className="CCPhoto bg-gray-200 w-28 h-28 rounded-md"
               
          >
            
              <img
                src={coordinator.image}
                alt={`Coordinator ${index + 1}`}
                className="w-24 h-24 rounded-full object-cover"
     
              />
            
          </div>
        ))}
        </div>

        {/* Pagination Controls */}
        <nav
          aria-label="Page navigation example"
          className="mt-0 flex justify-center AnnualNav"
          
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
            {/* <li className="page-item"><a className="page-link" href="#">1</a></li>
          <li className="page-item"><a className="page-link" href="#">2</a></li>
          <li className="page-item"><a className="page-link" href="#">3</a></li> */}
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
        </nav>
      </div>
      



     

      <div className="f1 AnnualFooterStart" >
        <div
          className="AboutUs"
          
        >
          Join NSS, Be the Change!
          <p >
            If you are passionate about making a difference, become a part of
            our NSS family today and contribute to a better, brighter future!
          </p>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
}

export default AnnualCampPage;
