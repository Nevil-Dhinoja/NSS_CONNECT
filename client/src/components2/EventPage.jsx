import React, { useState } from "react";
import image1 from "../assets/Event1.jpg";
import image2 from "../assets/Event2.jpg";
import image3 from "../assets/Event3.jpg";
import image4 from "../assets/Event4.jpg";
import "./MianPart.css";
import Footer from "../components/Footer";

const villageImages = {
  Gada: [image1],
  Ramol: [image2],
  Maliyataj: [image3],
  Demol: [image1],
  Ghuntil: [image2],
  Anand: [image3],
  padgol: [image1],
  Changa: [image2],
  Alindra: [image3],
  Dethali: [image1],
  Thaltedi: [image1, image2, image3, image2], // Show 4 images
  Dabhou: [image1, image2, image3, image2],  // Show 4 images
};

const initiatives = [
  { title: "Orientation", image: image2 },
  { title: "Blood Conation", image: image3 },
  { title: "Cleanliess Drive", image: image4 },
  { title: "Tree plantation", image: image1 },
  { title: "Its's Time To Stop", image: image2 },
  { title: "Breast Censer", image: image2 },
  { title: "Smile Fista", image: image3 },
  { title: "CRP", image: image4 },
  { title: "Organ Donation", image: image1 },
  { title: "State Compititons", image: image2 },
  { title: "Annual Camp", image: image2 },
  { title: "Animal Rescue", image: image2 },
  { title: "Youth Parilament", image: image2 },
  { title: "Polo Forest", image: image2 },
  { title: "Run For Unit", image: image2 },
  { title: "HelthCheckeup", image: image2 },
  { title: "Republic Day", image: image2 },
  { title: "Indepndent Day", image: image2 },
  { title: "Trafic & Road Safty", image: image2 },
];

function EventPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const openModal = (village) => {
    setSelectedImages(villageImages[village]);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImages([]);
  };

  return (
    <>
      {/* Village Modal Section */}
      <div className="campus-container" style={{background:"white"}}>
        <header className="campus-header">CHARUSAT Adopted Villages</header>
        <div className="campus-grid">
          {Object.keys(villageImages).map((village) => (
            <button key={village} className="campus-button" onClick={() => openModal(village)}>
              {village}
            </button>
          ))}
        </div>
      </div>
      
      <div className="campus-container">
      <header className="campus-header">Achivement</header>
      <p className="AchivementsPoints">
      1.Best campus Ambassador of Anand District by Office of the District Election Officer &   amp; Collector, Anand 2019-20- Jaimesh Lathiya
      <br></br>
      2. Certificate of Appreciation by Vegan Outreach, India, 2020-21
      <br></br>
      3. Saraswat Award for contribution in educational and literature field (Saraswat Award- 2021 ) by Achala Education Foundation Trust Ahmedabad, 2020-21 -Vandan Kalathiya
      <br></br>
      4. Rastriya Prerna Doot Award by Face of Future India for Recognition of outstanding activities to Community, 2021-22 - Vandan Kalathiya
      <br></br>
      5. State NSS Award for Corona Services by State NSS Cell, Gandhinagar - Mr.Robert Parmar
      </p>
      </div>
      {/* Initiatives Section */}
      <div className="initiatives-container">
        <h2 className="initiatives-header">Events</h2>
        <div className="initiatives-grid">
          {initiatives.map((initiative, index) => (
            <div key={index} className="initiative-card">
              <img src={initiative.image} alt={initiative.title} className="initiative-image" />
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
                <img key={index} src={img} alt="Village Event" className="modal-image" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="f1" style={{ width: "100%" }}>
        <div className="AboutUs" style={{ flexDirection: "column", height: "80px" }}>
          Join NSS, Be the Change!
          <p style={{ fontSize: "10px", fontWeight: "500" }}>
            If you are passionate about making a difference, become a part of our NSS family today and contribute to a better, brighter future!
          </p>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default EventPage;