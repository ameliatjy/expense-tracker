import "../../../styles/styles.css"
import {memo, useState} from "react";
import DateInput from "./DateInput";
import {FORM_LABELS} from "../constants/labels";

let DateRangeField = ({ onDateFromChange, onDateToChange }) => {
  const [dateFrom, setDateFrom] = useState()
  const [dateTo, setDateTo] = useState()

  return (
    <label className="date-range-label">
      {FORM_LABELS.SELECT_DATE_RANGE}
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
