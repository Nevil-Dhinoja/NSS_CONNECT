import "../components/style.css";
import "./Download.css";
import pdf1 from "../assets/pdf1.pdf"
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import manualNss2006 from "../assets/manualNss2006.pdf";

function Download() {
    return (
        <>
        <Nav/>
            <div className="download-container">
                <h4
                    className="text-center text-xl font-semibold text-gray-800 mb-6"
                    style={{ color: "#0765a5", marginTop: "50px" }}
                >
                    Program Coordinator
                </h4>
            </div>

            <div className="pdf">
                <div className="pdfTop" style={{ 
                   
                    overflowY: "scroll", 
                    border: "1px solid #ccc", 
                    padding: "10px",
                    scrollbarWidth: "thin", /* For Firefox */
                    scrollbarColor: "#0765a5 #f1f1f1" /* Thumb & Track color */
                }}>
                    <iframe 
                        src={manualNss2006} 
                        width="100%" 
                        height="100%" 
                        style={{ border: "none",background:"white",borderRadius:"20PX" }}
                    />
                </div>

                {/* <div className="pdfBottom">

                </div> */}
            </div>

            <Footer/>
        </>
    );
}

export default Download;
