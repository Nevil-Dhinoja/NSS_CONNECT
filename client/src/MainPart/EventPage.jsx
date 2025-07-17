import React, { useState } from "react";
import image1 from "../assets/Event1.jpg";
import image2 from "../assets/Event2.jpg";
import image3 from "../assets/Event3.jpg";
import image4 from "../assets/Event4.jpg";
// import image5 from "../assets/Event5.jpg";
// import image6 from "../assets/Event6.jpg";


import image7 from "../assets/BloodDonation/bloodDo4.jpg";
import image8 from "../assets/BloodDonation/bloodDo5.jpg";
import image9 from "../assets/BloodDonation/bloodDo6.jpg";
import image10 from "../assets/BloodDonation/bloodDo1.jpeg";

import image1_1 from "../assets/Orientation/Orientation1.jpeg";
import image1_2 from "../assets/Orientation/Orientation2.jpeg";
import image1_3 from "../assets/Orientation/Orientation3.jpeg";
import image1_4 from "../assets/Orientation/Orientation4.jpeg";
import image1_5 from "../assets/Orientation/Orientation5.jpeg";
import image1_6 from "../assets/Orientation/Orientation6.jpeg";

import imageA11 from "../assets/AnimalRescue/A1.WEBP";
import imageA12 from "../assets/AnimalRescue/A3.jpeg";
import imageA13 from "../assets/AnimalRescue/A2.WEBP";
import imageA14 from "../assets/AnimalRescue/A4.jpeg";

import imageB1 from "../assets/BreastCancer/BreastCancer1.jpg";
import imageB2 from "../assets/BreastCancer/BreastCancer2.jpg";
import imageB3 from "../assets/BreastCancer/BreastCancer3.jpg";
import imageB4 from "../assets/BreastCancer/BreastCancer4.jpg";
import imageB5 from "../assets/BreastCancer/BreastCancer5.jpg";
import imageB6 from "../assets/BreastCancer/BreastCancer6.jpg";

import imagec1 from "../assets/CLDRV/CLDRV1.jpg";
import imagec2 from "../assets/CLDRV/CLDRV2.jpg";
import imagec3 from "../assets/CLDRV/CLDRV3.jpg";
import imagec4 from "../assets/CLDRV/CLDRV4.jpeg";
import imagec5 from "../assets/CLDRV/CLDRV5.jpeg";
import imagec6 from "../assets/CLDRV/CLDRV6.jpeg";

import imageCP1 from "../assets/CPR/CPR1.jpeg";
import imageCP2 from "../assets/CPR/CPR2.jpeg";
import imageCP3 from "../assets/CPR/CPR3.jpeg";
import imageCP4 from "../assets/CPR/CPR4.jpeg";

import imageI1 from "../assets/ITS/ITS1.jpeg";
import imageI2 from "../assets/ITS/ITS2.jpeg";
import imageI3 from "../assets/ITS/ITS3.jpeg";
import imageI4 from "../assets/ITS/ITS4.jpeg";
import imageI5 from "../assets/ITS/ITS5.jpeg";
import imageI6 from "../assets/ITS/ITS5.jpeg";

import imageO1 from "../assets/OrganDonation/OD1.jpg";
import imageO2 from "../assets/OrganDonation/OD2.jpeg";
import imageO3 from "../assets/OrganDonation/OD3.jpeg";
import imageO4 from "../assets/OrganDonation/OD4.jpeg";

import imagef1 from "../assets/SmileFiesta/sf1.jpg";
import imagef2 from "../assets/SmileFiesta/sf2.jpg";
import imagef3 from "../assets/SmileFiesta/sf3.jpg";
import imagef4 from "../assets/SmileFiesta/sf4.jpeg";
import imagef5 from "../assets/SmileFiesta/sf5.jpg";
import imagef6 from "../assets/SmileFiesta/sf6.jpg";

import imaget1 from "../assets/TreePlantaion/t1.jpeg"
import imaget2 from "../assets/TreePlantaion/t2.jpeg"
import imaget3 from "../assets/TreePlantaion/t3.jpeg"
import imaget4 from "../assets/TreePlantaion/t4.jpeg"
import imaget5 from "../assets/TreePlantaion/t5.jpeg"
import imaget6 from "../assets/TreePlantaion/t6.jpeg"

import imagewpd1 from "../assets/World Pharmist Day/w1.jpeg"
import imagewpd2 from "../assets/World Pharmist Day/w2.jpeg"
import imagewpd3 from "../assets/World Pharmist Day/w3.jpeg"
import imagewpd4 from "../assets/World Pharmist Day/w4.jpeg"

import imageRP1 from "../assets/Republic & independence Day/R2.jpg"
import imageRP2 from "../assets/Republic & independence Day/R2.jpg"
import imageRP3 from "../assets/Republic & independence Day/R3.jpg"
import imageRP4 from "../assets/Republic & independence Day/R4.jpg"

import imageIN1 from "../assets/Republic & independence Day/In1.jpg"
import imageIN2 from "../assets/Republic & independence Day/In2.jpg"
import imageIN3 from "../assets/Republic & independence Day/In3.jpeg"
import imageIN4 from "../assets/Republic & independence Day/In4.jpeg"

// import imagebg from "../assets/bg4.jpg";

import "./MianPart.css";


const villageImages = {
  Gada: [image1],
  Ramol: [image2],
  Maliyataj: [image3],
  Demol: [image1],
  Ghuntil: [image2],
  Anand: [image3],
  Padgol: [image1],
  Changa: [image2],
  Alindra: [image3],
  Dethali: [image1],
  Thaltedi: [image1, image2, image3, image2],
  Dabhou: [image1, image2, image3, image2],
};

const initiatives = [
  { title: "Orientation", images: [image1_1, image1_2, image1_3, image1_4, image1_5, image1_6] },
  { title: "Blood Donation", images: [image7, image8, image9, image10] },
  { title: "Animal Rescue", images: [imageA13, imageA14, imageA11, imageA12] },
  { title: "Breast Cancer Awareness", images: [imageB1, imageB2, imageB3, imageB4, imageB5, imageB6] },
  { title: "Cleanliness Drive", images: [imagec1, imagec2, imagec3, imagec4, imagec5, imagec6] },
  { title: "CPR", images: [imageCP1, imageCP2, imageCP3, imageCP4] },
  { title: "It's Time To Stop", images: [imageI1, imageI2, imageI5, imageI4, imageI3, imageI6] },
  { title: "Organ Donation", images: [imageO3, imageO1, imageO2, imageO4] },
  { title: "Smile Fiesta", images: [imagef4, imagef2, imagef5, imagef6, imagef3, imagef1] },
  { title: "Tree Plantation", images: [imaget1, imaget2, imaget3, imaget6, imaget5, imaget4] },
  { title: "World Pharmacist Day", images: [imagewpd1, imagewpd2, imagewpd3, imagewpd4] },
  { title: "Republic Day", images: [imageRP1, imageRP2, imageRP3, imageRP4] },
  { title: "Independence day", images: [imageIN1, imageIN2, imageIN3, imageIN4] },
  //  { title: "Other Memory", image:[imageIN1], driveLink:"https://drive.google.com/drive/folders/1zbPXPL_5Eh6O0j4-vXirgdYDpAgVHX0T" },
];

function EventPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const openModal = (images) => {
    setSelectedImages(images);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImages([]);
  };

  const openDrive = (link) => {
    window.open(link, "_blank"); // Opens Google Drive in a new tab
  };


  return (
    <>
      {/* Village Modal Section */}
      <div className="campus-container" style={{ background: "white" }}>
        <header className="campus-header">CHARUSAT Adopted Villages</header>
        <div className="campus-grid">
          {Object.keys(villageImages).map((village) => (
            <button
              key={village}
              className="campus-button"
              onClick={() => openModal(villageImages[village])}
            >
              {village}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="campus-container">
        <header className="campus-header">Achievement</header>
        <p className="AchivementsPoints">
          1. Best Campus Ambassador of Anand District by Office of the District Election Officer & Collector, Anand 2019-20 - Jaimesh Lathiya  
          <br></br>
          2. Certificate of Appreciation by Vegan Outreach, India, 2020-21  
          <br></br>
          3. Saraswat Award for contribution in the educational and literature field (Saraswat Award - 2021) by Achala Education Foundation Trust, Ahmedabad, 2020-21 - Vandan Kalathiya  
          <br></br>
          4. Rashtriya Prerna Doot Award by Face of Future India for recognition of outstanding activities in the community, 2021-22 - Vandan Kalathiya  
          <br></br>
          5. State NSS Award for Corona Services by State NSS Cell, Gandhinagar - Mr. Robert Parmar  
        </p>
      </div>

      {/* Initiatives Section */}
      <div className="initiatives-container">
        <h2 className="initiatives-header">Events</h2>
        <div className="initiatives-grid">
          {initiatives.map((initiative, index) => (
            <div
              key={index}
              className="initiative-card"
              onClick={() => initiative.driveLink ? openDrive(initiative.driveLink) : openModal(initiative.images)}
            >
              <img
                src={initiative.images ? initiative.images[0] : "https://via.placeholder.com/150"}
                alt={initiative.title}
                className="initiative-image"
              />
              <div className="initiative-title">{initiative.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Popup */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className={selectedImages.length > 1 ? "modal-grid" : "modal-single"}>
              {selectedImages.map((img, index) => (
                <img key={index} src={img} alt="Event" className="modal-image" />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EventPage;

// import React, { useState } from "react";
// import image1 from "../assets/Event1.jpg";
// import image2 from "../assets/Event2.jpg";
// import image3 from "../assets/Event3.jpg";
// import image4 from "../assets/Event4.jpg";
// import "./MianPart.css";

// const villageImages = {
//   Gada: [image1],
//   Ramol: [image2],
//   Maliyataj: [image3],
//   Demol: [image1],
//   Ghuntil: [image2],
//   Anand: [image3],
//   Padgol: [image1],
//   Changa: [image2],
//   Alindra: [image3],
//   Dethali: [image1],
//   Thaltedi: [image1, image2, image3, image2],
//   Dabhou: [image1, image2, image3, image2],
// };

// const initiatives = [
//   { title: "Orientation", image: image2 },
//   { title: "Blood Donation", image:image3},
//   { title: "Cleanliness Drive", image: image4 },
//   { title: "Tree Plantation", image: image1 },
//   { title: "It's Time To Stop", image: image2 },
//   { title: "Breast Cancer Awareness", image: image2 },
//   { title: "Smile Fiesta", image: image3 },
//   { title: "CRP", image: image4 },
//   { title: "Organ Donation", image: image1 },
//   { title: "State Competitions", image: image2 },
//   { title: "Annual Camp", image: image2 },
//   { title: "Animal Rescue", image: image2 },
//   { title: "Youth Parliament", image: image2 },
//   { title: "Polo Forest", image: image2 },
//   { title: "Run For Unity", image: image2 },
//   { title: "Health Checkup", image: image2 },
//   { title: "Republic Day", image: image2 },
//   { title: "Independence Day", image: image2 },
//   { title: "Traffic & Road Safety", image: image2 },
// ];

// function EventPage() {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedImages, setSelectedImages] = useState([]);

//   const openModal = (images) => {
//     setSelectedImages(images);
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setSelectedImages([]);
//   };

//   return (
//     <>
//       {/* Village Modal Section */}
//       <div className="campus-container" style={{background:"white"}}>
//         <header className="campus-header">CHARUSAT Adopted Villages</header>
//         <div className="campus-grid">
//           {Object.keys(villageImages).map((village) => (
//             <button
//               key={village}
//               className="campus-button"
//               onClick={() => openModal(villageImages[village])}
//             >
//               {village}
//             </button>
//           ))}
//         </div>
//       </div>
      
//        <div className="campus-container">
//        <header className="campus-header">Achivement</header>
//        <p className="AchivementsPoints">
//   1. Best Campus Ambassador of Anand District by Office of the District Election Officer & Collector, Anand 2019-20 - Jaimesh Lathiya  
//   <br></br>
//   2. Certificate of Appreciation by Vegan Outreach, India, 2020-21  
//   <br></br>
//   3. Saraswat Award for contribution in the educational and literature field (Saraswat Award - 2021) by Achala Education Foundation Trust, Ahmedabad, 2020-21 - Vandan Kalathiya  
//   <br></br>
//   4. Rashtriya Prerna Doot Award by Face of Future India for recognition of outstanding activities in the community, 2021-22 - Vandan Kalathiya  
//   <br></br>
//   5. State NSS Award for Corona Services by State NSS Cell, Gandhinagar - Mr. Robert Parmar  
// </p>

//        </div>

//       {/* Initiatives Section */}
//       <div className="initiatives-container">
//         <h2 className="initiatives-header">Events</h2>
//         <div className="initiatives-grid">
//           {initiatives.map((initiative, index) => (
//             <div
//               key={index}
//               className="initiative-card"
//               onClick={() => openModal([initiative.image])}
//             >
//               <img
//                 src={initiative.image}
//                 alt={initiative.title}
//                 className="initiative-image"
//               />
//               <div className="initiative-title">{initiative.title}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Modal Popup */}
//       {modalOpen && (
//         <div className="modal-overlay" onClick={closeModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className={selectedImages.length > 1 ? "modal-grid" : "modal-single"}>
//               {selectedImages.map((img, index) => (
//                 <img key={index} src={img} alt="Event" className="modal-image" />
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default EventPage;
