import "../assets/styles.css"
import {memo} from "react";

let InputField = ({ id, label, type, defaultValue }) => {
  return (
    <div id="modal-fields">
      <label>{label}</label>
      <input type={type} id={id} name={id} defaultValue={defaultValue} />
    </div>
  )
}
InputField = memo(InputField)
export default InputField
