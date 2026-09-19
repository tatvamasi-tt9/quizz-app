import { IoDocumentTextOutline } from "react-icons/io5";
import { GrDocumentPdf } from "react-icons/gr";
import { RiImage2Line } from "react-icons/ri";
import { FiExternalLink } from "react-icons/fi";
import Button from "./Button";

const Source = ({ onText, onPdf ,onImage,onLink}) => {
  return (
    <div className="flex flex-col w-220 mx-auto mt-10">
      <p className="text-lg my-4 font-bold">
        Now, select source material
      </p>

      <div className="flex gap-30 mb-4">
        {/* PDF */}
        <Button
          heading="PDF"
          icon={GrDocumentPdf}
          value={onPdf}
        />

        {/* Image (future) */}
        <Button
          heading="Image"
          icon={RiImage2Line}
          value={onImage}
        />

        {/* Text */}
        <Button
          heading="Text"
          icon={IoDocumentTextOutline}
          value={onText}
        />
        {/* Link */}
        <Button
          heading="Link to a webpage"
          icon={ FiExternalLink }
          value={onLink}
        />
      </div>
    </div>
  );
};

export default Source;
