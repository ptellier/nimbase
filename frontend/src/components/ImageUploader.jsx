import {useRef} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUpFromBracket, faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
import {Button} from "@chakra-ui/react";

const ImageUploader = ({error, image, setImage}) => {
  const imageInput = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file.type === "image/jpeg" || file.type === "image/png") {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  }

  return (
    <div className="image-upload-container">
      {(error) ?
        <span className="error-text"><FontAwesomeIcon icon={faTriangleExclamation} /> {error}</span>
        :
        null
      }
      <div className="image-upload-image-container">
        <img width="100%" src={image || "https://returntofreedom.org/store/wp-content/uploads/default-placeholder.png" } alt={"uploaded image of project"}
             className="image-uploader-image" style={{textAlign:"center"}}/>
      </div>
      <input
        style={{display:"none"}}
        type="file"
        accept="image/*"
        ref={imageInput}
        onChange={handleFileChange}
      />
      <Button variant="customDefault"  type="button" onClick={() => {imageInput.current.click()}} style={{marginTop:"1em"}}>
        Upload
        <FontAwesomeIcon icon={faArrowUpFromBracket} style={{marginLeft:"0.5em"}}/>
      </Button>
    </div>
  )
}

export default ImageUploader;