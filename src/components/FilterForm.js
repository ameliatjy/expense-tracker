import {LABELS} from "../constants/labels";
import {MONTHS} from "../constants/months";
import {CATEGORIES} from "../constants/categories";
import SelectField from "./SelectField";
import DateRangeField from "./DateRangeField";
import Button from "./Button";
import "../assets/styles.css"

const FilterForm = ({ filter, setFilter }) => {
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
        id="select-month"
        label={LABELS.SELECT_MONTH}
        values={MONTHS}
        onChange={e => onChange(e, "month", LABELS.ALL)}
      />
      <SelectField
        id="select-category"
        label={LABELS.SELECT_CATEGORY}
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
        label={LABELS.CLEAR_FILTERS}
        onClick={() => setFilter({})}
      />
    </form>
  )
}

export default FilterForm
