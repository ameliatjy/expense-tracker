import "../assets/styles.css"
import {LABELS} from "../constants/labels";
import {memo} from "react";

let SelectField = ({ id, label, values, selected, isAllAllowed = true, onChange }) => {

  return (
    <label className="filter-label">
      {label}
      <select id={id} className="select-field" onChange={onChange}>
        { isAllAllowed
          ? <option value={LABELS.ALL} selected={selected === undefined}>{LABELS.ALL}</option>
          : <></>
        }
        {values.map((value) => {
          return (<option value={value} key={value} selected={selected === value}>{value}</option>)
        })}
      </select>
    </label>
  )
}
SelectField = memo(SelectField)
export default SelectField
