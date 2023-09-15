import {memo} from "react";

import SelectField from "../SelectField";
import DateRangeField from "./components/DateRangeField";
import Button from "../button";

import {BUTTON_LABELS} from "../button/constants";
import {LABELS} from "../../constants/labels";
import {MONTHS} from "./constants/months";
import {CATEGORIES} from "../../constants/categories";
import {FORM_LABELS} from "./constants/labels";
import "../../styles/styles.css"

let FilterForm = ({ filter, setFilter }) => {
  console.log("rerender filterform")
  const onChange = (event, fieldName, defaultValue) => {
    if (event.target.value !== defaultValue) {
      setFilter(f => ({...f, [fieldName]: event.target.value}))
    } else {
      setFilter(f => {
        const { [fieldName]: a, ...others } = f
        return others
      })
    }
  }

  return (
    <form id="filter-form">
      <SelectField
        label={FORM_LABELS.SELECT_MONTH}
        values={MONTHS}
        onChange={e => onChange(e, "month", LABELS.ALL)}
      />
      <SelectField
        label={FORM_LABELS.SELECT_CATEGORY}
        values={CATEGORIES}
        onChange={e => onChange(e, "category", LABELS.ALL)}
      />
      <DateRangeField
        onDateFromChange={e => onChange(e, "dateFrom", "")}
        onDateToChange={e => onChange(e, "dateTo", "")}
      />
      <Button
        className={"clear-filters-button " + (Object.keys(filter).length === 0 ? "" : "visible")}
        type={"reset"}
        label={BUTTON_LABELS.CLEAR_FILTERS}
        onClick={() => setFilter({})}
      />
    </form>
  )
}
FilterForm = memo(FilterForm)
export {FilterForm}
