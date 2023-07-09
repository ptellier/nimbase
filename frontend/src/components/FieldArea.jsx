import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";


const Field = ({ label, name, value, onChange, required, autoComplete, error, cols, rows}) => {
  return (
    <div className={(error) ? "field-with-error field-div" : "field-div"}>
      <span style={{ display: "inline-block", width: "0.5em" }} />
      <label htmlFor={name+"field"}>{label}: {(error) ?
        <span className="error-text"><FontAwesomeIcon icon={faTriangleExclamation} /> {error}</span>
        :
        null}
      </label>
      <textarea
        id={name+"field"}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        style={{display:"block"}}
        cols={cols}
        rows={rows}
      />
    </div>
  )
}

export default Field;