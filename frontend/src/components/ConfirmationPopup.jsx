// Reference: used co-pilot to help generate this component

const ConfirmationPopup = ({open, setOpen, headerText, bodyText, cancelButtonText, onConfirm}) => {

  const handleClose = () => setOpen(false);

  return (
    (open) ?
      <>
        <div className="darken-background"></div>
        <div className="popup-container">
          <div className="popup">
            <h3>{headerText}</h3>
            <p>{bodyText}</p>
            <div style={{display:"flex", justifyContent: "flex-end", columnGap: "2em"}}>
              <button onClick={handleClose}>Cancel</button>
              <button onClick={onConfirm}>{cancelButtonText}</button>
            </div>
          </div>
        </div>
      </>
      :
      null
  );
}

export default ConfirmationPopup;