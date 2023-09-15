import {memo} from "react";

import SelectField from "../SelectField";
import DateRangeField from "./components/DateRangeField";
import Button from "../button";

import {BUTTON_LABELS} from "../button/constants";
import {LABELS} from "../../constants/labels";
import {MONTHS} from "./constants/months";
import {CATEGORIES} from "../../constants/categories";
import {FORM_LABELS} from "./constants/labels";
import {HOME_PAGE_ACTION_TYPES} from "../../pages/home/constants";
import "../../styles/styles.css"

let FilterForm = ({ filter, dispatch }) => {
  console.log("rerender filterform")
  const onChange = (event, fieldName, defaultValue) => {
    if (event.target.value !== defaultValue) {
      dispatch({
        type: HOME_PAGE_ACTION_TYPES.ADD_FILTER,
        filter: { [fieldName]: event.target.value }
      })
    } else {
      dispatch({
        type: HOME_PAGE_ACTION_TYPES.REMOVE_FILTER,
        fieldName: fieldName
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
        onClick={() => dispatch({ type: HOME_PAGE_ACTION_TYPES.RESET_FILTER })}
      />
    </form>
  )
}
FilterForm = memo(FilterForm)
export {FilterForm}
