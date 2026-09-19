import { forwardRef, useRef, useState, useImperativeHandle } from "react";



///   summary -> when parent calls open() function ( when user click pdf div of source ) , this <input> dom element will get clicked using fileInputRef.current?.click()
// now when <input > with type='file' get clicked , browser open our file manager . now when we select a folder , onchange will trigger  and handlefilechange will  execute 






const UploadPdf = forwardRef(({ onTextExtracted, onLoading }, ref) => {
  const fileInputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    open() {
      fileInputRef.current?.click();
    }
  }));

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      onLoading(true); 

      const response = await fetch("http://localhost:8080/upload/pdf", {
        method: "POST",
        credentials: "include",
        body: formData
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Failed to extract PDF");
        return;
      }

      onTextExtracted(data.text); // send text AFTER success

    } catch (err) {
      console.error(err);
      alert("PDF upload failed");
    } finally {
      onLoading(false); 
      e.target.value = "";
    }
  }

  return (
    <input
      ref={fileInputRef}
      type="file"
      accept="application/pdf"
      hidden
      onChange={handleFileChange}
    />
  );
});

export default UploadPdf;
