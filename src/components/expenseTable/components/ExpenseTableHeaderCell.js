import {memo, useState} from "react";

import ArrowUpIcon from "../../../assets/ArrowUpIcon";
import ArrowDownIcon from "../../../assets/ArrowDownIcon";

import {TABLE_LABELS} from "../constants";

let ExpenseTableHeaderCell = ({ label, attribute, onClick, sortedColumn }) => {
  const [isAscending, setIsAscending] = useState(null)
  console.log("rerender expensetableheader")

  if (label === TABLE_LABELS.ACTIONS) {
    return (
      <th className="actions-column">
        {label}
      </th>
    )
  }

  const isSortedByColumn = sortedColumn === attribute
  const onHeaderClick = e => {
    let compare;
    if (attribute === "cost") {
      compare = (rowA, rowB) => {
        return (
          isAscending
            ? Number(rowB[attribute]) - Number(rowA[attribute])
            : Number(rowA[attribute]) - Number(rowB[attribute])
        );
      }
    } else {
      compare = (rowA, rowB) => {
        return (
          isAscending
            ? rowA[attribute] > rowB[attribute] ? -1 : 1
            : rowA[attribute] > rowB[attribute] ? 1 : -1
        );
      }
    }
    setIsAscending(a => a === null ? true : !a)
    onClick()
  }

  return (
    <th onClick={onHeaderClick}>
      {label}
      <ArrowUpIcon visibility={(isSortedByColumn && isAscending) ? "visible" : "hidden"} />
      <ArrowDownIcon visibility={(!isSortedByColumn || isAscending === null || isAscending) ? "hidden" : "visible"} />
    </th>
  )
}
ExpenseTableHeaderCell = memo(ExpenseTableHeaderCell)
export default ExpenseTableHeaderCell