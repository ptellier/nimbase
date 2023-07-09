import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";


const Field = ({ label, name, type, value, onChange, required, autoComplete, error, width}) => {
  return (
    <div className={(error) ? "field-with-error field-div" : "field-div"} style={{width:width}}>
      <span style={{ display: "inline-block", width: "0.5em" }} />
      <label htmlFor={name+"field"}>{label}: {(error) ?
        <span className="error-text"><FontAwesomeIcon icon={faTriangleExclamation} /> {error}</span>
        :
        null}
      </label>
      <input
        type={type}
        id={name+"field"}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
      />
    </div>
  )
}

export default Field;