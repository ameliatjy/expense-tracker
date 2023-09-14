import ArrowUpIcon from "../assets/ArrowUpIcon";
import ArrowDownIcon from "../assets/ArrowDownIcon";
import {useState} from "react";

const ExpenseTableHeader = ({ label, attribute, data, setData, onClick, sortedColumn }) => {
  const [isAscending, setIsAscending] = useState(null)
  const isSortedByColumn = sortedColumn === attribute
  console.log("rerender expensetableheader")

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
    setData(data.toSorted(compare))
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

export default ExpenseTableHeader