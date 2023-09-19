import {memo} from "react";

let DateInput = ({ max, min, onChange }) => {
  return (
    <input
      type="date"
      className="date-range"
      max={max}
      min={min}
      onChange={onChange}
    />
  )
}
DateInput = memo(DateInput)
export default DateInput
