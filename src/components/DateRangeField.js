import {LABELS} from "../constants/labels";
import "../assets/styles.css"
import {memo, useState} from "react";
import DateInput from "./DateInput";

let DateRangeField = ({ onDateFromChange, onDateToChange }) => {
  const [dateFrom, setDateFrom] = useState()
  const [dateTo, setDateTo] = useState()

  return (
    <label className="date-range-label">
      {LABELS.SELECT_DATE_RANGE}
      <br />
      <DateInput
        max={dateTo}
        onChange={e => {
          onDateFromChange(e)
          setDateFrom(e.target.value)
        }}
      />
      <span> to </span>
      <DateInput
        min={dateFrom}
        onChange={e => {
          onDateToChange(e)
          setDateTo(e.target.value)
        }}
      />
    </label>
  )
}
DateRangeField = memo(DateRangeField)
export default DateRangeField
