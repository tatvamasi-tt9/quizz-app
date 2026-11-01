import Navbar from "../loginandsignup/1st_page/Navbar";
import TypeofQuestion from "./TypeofQuestion";
import Source from "./Source";
import Difficulty from "./Difficulty";
import { Uploadtext } from "../Upload/Upload_text";
import UploadPdf from "../Upload/UploadPdf";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadingPopup from "../Upload/Uploadingpopup";
import UploadImage from "../Upload/UploadImage";
import  GenratingAnimation  from "./GenratingAnimation";
const Second_page = () => {
  const navigate = useNavigate();
  const [showText, setShowText] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [LinkUploading, setLinkUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [Link,setLink]=useState("");
  const [Generating,setGenerating]=useState(false);

  const [inputt, setinputt] = useState({
    TypeofQuestion: "",
    input_text: "",
    difficulty: ""
  });

  const textSectionRef = useRef(null);
  const imageRef = useRef(null);
  const pdfRef = useRef(null);


  function handleImageClick() {
  imageRef.current?.open();
}

function handleImageText(text) {
  handleSelect("input_text", text);
  setUploadStatus("image");
}

function handleLink()
{
   setLinkUploading(true);
}

  /* ------------------ auto scroll ------------------ ------------------*/
  useEffect(() => {
    if (showText && textSectionRef.current) {
      textSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [showText]);

  /* ------------------ state helpers ------------------ */
  function handleSelect(key, value) {
    setinputt(prev => ({
      ...prev,
      [key]: value
    }));
  }

  function openTextEditor() {
    setShowText(true);
      setUploadStatus(null);
  }

  function closeTextEditor() {
    setShowText(false);
  }

  
  /*-------------------Link -> text ---------------------------*/
  function handleLinkText(text){
    handleSelect('input_text',text);
    setUploadStatus("link ");
  }
  
  
  /* ------------------ submit - analyze document ------------------ */
  const handleSubmit = async () => {
    try {
      setGenerating(true);

      const response = await fetch(
        "http://localhost:8080/analyze-document",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            input_text: inputt.input_text,
          }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const data = await response.json();

      console.log(data);

      // Navigate to cluster topic page with docId and clusters data
      navigate("/cluster-topics", {
        state: {
          docId: data.docId,
          clusters: data.clusters,
          difficulty: inputt.difficulty
        }
      });

    } catch (err) {
      console.error(err);
      alert("Failed to analyze document. Please try again.");

      // Important: allow the user to try again
      setGenerating(false);
    }
  };

  /* ------------------ COMMENTED OUT - Original quiz generation ------------------ */
  // const handleSubmit = async () => {
  //   try {
  //     setGenerating(true);
  //
  //     const response = await fetch(
  //       "http://localhost:8080/generate-questions",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         credentials: "include",
  //         body: JSON.stringify({
  //           input_text: inputt.input_text,
  //           difficulty: inputt.difficulty,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       const text = await response.text();
  //       throw new Error(text);
  //     }
  //
  //     const data = await response.json();

  //     const sessionId = data.sessionId;

  //     console.log(data);

  //     navigate(`/questions/${sessionId}`);

  //   } catch (err) {
  //     console.error(err);
  //
  //     // Important: allow the user to try again
  //     setGenerating(false);
  //   }
  // };

  //---------------------------------------------------------------------
async function handleLinkSubmit() {
  try {
    setUploading(true);

    const res = await fetch("http://localhost:8080/extract-from-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials:"include",
      body: JSON.stringify({ url: Link })
    });
    
    const data = await res.json();
    
    if (!res.ok) throw new Error(data.message);
    
    handleLinkText(data.text); 
    setLinkUploading(false);

  } catch (err) {
    console.error(err);
    alert("Failed to extract text from link");
  } finally {
    setUploading(false);
  }
}










/*---------------for pdf-------------------------*/
function handlePdfClick() {
  pdfRef.current?.open();
}
/* ------------------ PDF to  text ------------------ */
function handlePdfTextExtracted(text) {
handleSelect("input_text", text);
setUploadStatus("pdf"); // ✅ show success
}

console.log(inputt);

  /* ------------------ UI ------------------ */
  return (
    <main>
      {Generating && <GenratingAnimation  />}
      {uploading && <UploadingPopup />}
      <Navbar />

      {/* TOP CARD */}
     <div className="border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm dark:shadow-2xl rounded-xl w-110 h-[52vh] mx-auto mt-10 transition-colors duration-300">
        <h1 className="ml-4 text-[30px] font-bold">
          Generate a Quiz
        </h1>

        <Difficulty
          select={value => handleSelect("difficulty", value)}
          placeholder={inputt.difficulty}
        />

        <TypeofQuestion
          select={value => handleSelect("TypeofQuestion", value)}
        />
      </div>

{/*-----------------------------------------------------------------------------*/}

      {/* SOURCE BUTTONS */}
      <Source
  onText={openTextEditor}
  onPdf={handlePdfClick}
  onImage={handleImageClick}
  onLink={handleLink}
/>

{/*/-------------------------------------------------------------------*/}
      {/* PDF UPLOAD  */}
      <UploadPdf
  ref={pdfRef}
  onTextExtracted={handlePdfTextExtracted}
  onLoading={setUploading}
/>
<UploadImage
  ref={imageRef}
  onTextExtracted={handleImageText}
  onLoading={setUploading}
/>


{/*-----------------------------Link work---------------------------------------------------------*/}

{LinkUploading && (
  <div className="flex gap-2 justify-center mt-4">
    <input
      type="text"
      value={Link}
      onChange={(e) => setLink(e.target.value)}
      placeholder="Paste article link..."
      className="border px-3 py-2 w-96 rounded"
    />

    <button
      onClick={handleLinkSubmit}
      className="bg-black text-white px-4 py-2 rounded"
    >
      Extract
    </button>
  </div>
)}





      {/* TEXT EDITOR */}
      {showText && (
        <div ref={textSectionRef}>
          <Uploadtext
            close={closeTextEditor}
            select={value => handleSelect("input_text", value)}
          />
        </div>
      )}
  {uploadStatus === "pdf" && (
  <p className="max-w-5xl mx-75 mt-3 text-green-600 font-medium">
    ✓ PDF uploaded successfully
  </p>
)}

{uploadStatus === "image" && (
  <p className="max-w-5xl mx-auto mt-3 text-green-600 font-medium">
    ✓ Image uploaded successfully
  </p>
)}

{uploadStatus === "link" && (
  <p className="max-w-5xl mx-auto mt-3 text-green-600 font-medium">
    ✓ Link content extracted successfully
  </p>
)}

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        disabled={Generating}
        className="bg-black text-white hover:bg-white hover:text-black
                   font-bold px-4 py-2 mx-180 rounded my-3 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        Submit
      </button>
    </main>
  );
};

export default Second_page;
