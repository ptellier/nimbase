import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@chakra-ui/react";

const ImageUploader = ({ error, image, setImage }) => {
  const imageInput = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file.type === "image/jpeg" || file.type === "image/png") {
      setPreviewImage(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // REFERENCE: PedroTech Firebase tutorial https://www.youtube.com/watch?v=YOAeBSCkArA&t=412s

  return (
    <div className="image-upload-container">
      {error ? (
        <span className="error-text">
          <FontAwesomeIcon icon={faTriangleExclamation} /> {error}
        </span>
      ) : null}
      <div className="image-upload-image-container">
        {previewImage || image ? (
          <img
            width="100%"
            src={previewImage ? previewImage : image}
            alt={"uploaded image of project"}
            className="image-uploader-image"
            style={{ textAlign: "center" }}
          />
        ) : (
          <div className="dashboard-image-error" />
        )}
      </div>
      <input
        style={{ display: "none" }}
        type="file"
        accept="image/*"
        ref={imageInput}
        onChange={handleFileChange}
      />
      <Button
        variant="customDefault"
        type="button"
        onClick={() => {
          imageInput.current.click();
        }}
        style={{ marginTop: "1em" }}
      >
        Upload
        <FontAwesomeIcon
          icon={faArrowUpFromBracket}
          style={{ marginLeft: "0.5em" }}
        />
      </Button>
    </div>
  );
};

export default ImageUploader;
