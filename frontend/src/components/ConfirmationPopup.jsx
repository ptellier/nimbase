// Reference: used co-pilot to help generate this component

import {faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const ConfirmationPopup = ({open, setClose, headerText, bodyText, errorText, cancelButtonText, onConfirm}) => {

  return (
    (open) ?
      <>
        <div className="darken-background"></div>
        <div className="popup-container">
          <div className="popup">
            <h3>{headerText}</h3>
            <p>{bodyText}</p>
            <div style={{display:"flex", justifyContent: "flex-end", columnGap: "2em"}}>
              <button onClick={setClose}>Cancel</button>
              <button onClick={onConfirm}>{cancelButtonText}</button>
            </div>
            {(errorText) ?
              <p className="error-text"><FontAwesomeIcon icon={faTriangleExclamation} /> {errorText}</p>
              :
              null
            }
          </div>
        </div>
      </>
      :
      null
  );
}

export default ConfirmationPopup;