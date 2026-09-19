import { forwardRef, useRef, useImperativeHandle } from "react";

const UploadImage = forwardRef(
  ({ onTextExtracted, onLoading }, ref) => {
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
      formData.append("image", file);

      try {
        onLoading(true);

        const response = await fetch(
          "http://localhost:8080/upload/image",
          {
            method: "POST",
            credentials: "include",
            body: formData
          }
        );

        const data = await response.json();

        if (!data.success) {
          alert(data.message || "Image OCR failed");
          return;
        }

        onTextExtracted(data.text);

      } catch (err) {
        console.error(err);
        alert("Image upload failed");
      } finally {
        onLoading(false);
        e.target.value = "";
      }
    }

    return (
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        hidden
        onChange={handleFileChange}
      />
    );
  }
);

export default UploadImage;
