import {Alert, AlertIcon, CloseButton} from "@chakra-ui/react";

const QueryAlert = ({alertText, status, handleClose}) => {
  return (
    <Alert status={status} variant='subtle'>
      <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
        <div style={{display: "flex", justifyContent: "flex-start", width: "100%"}}>
          <AlertIcon/>
          {alertText}
        </div>
        <CloseButton size="large" onClick={handleClose}/>
      </div>
    </Alert>
  )
}

export default QueryAlert;
