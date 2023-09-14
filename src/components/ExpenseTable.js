import {LABELS} from "../constants/labels";
import "../assets/styles.css"
import {memo, useEffect, useState} from "react";
import useDarkMode from "../contexts/useDarkMode";
import ExpenseRow from "./ExpenseRow";
import ExpenseTableHeader from "./ExpenseTableHeader";
import useSortedColumn from "../contexts/useSortedColumn";

function getData(keys) {
  if (keys === null) {
    return;
  }
  const keysArr = JSON.parse(keys);
  const allData = []
  for (const key of keysArr) {
    allData.push(JSON.parse(localStorage.getItem(key)));
  }
  return allData
}
function ExpenseTable({ keys, isEdited, filter, openEditModal }) {
  const [data, setData] = useState(() => getData(keys))
  const [sortedColumn, setSortedColumn] = useSortedColumn()
  console.log("rerender expensetable")

  useEffect(() => {
    if (keys === null) {
      return;
    }
    const keysArr = JSON.parse(keys);
    const allData = []
    for (const key of keysArr) {
      allData.push(JSON.parse(localStorage.getItem(key)));
    }
    setData(allData)
  }, [isEdited]);

  let total = 0
  const [isDarkMode, ] = useDarkMode()

  const shouldDisplayRow = row => {
    if (filter.month && filter.month !== row.date.toLocaleString('default', { month: 'long' })) {
      return false
    }
    if (filter.category && filter.category !== row.category) {
      return false
    }
    if (filter.dateFrom && Date.parse(row.date) < Date.parse(filter.dateFrom)) {
      return false
    }
    if (filter.dateTo && Date.parse(row.date) > Date.parse(filter.dateTo)) {
      return false
    }
    return true
  }

  return (
    <table className="expenses-table">
      <thead className={isDarkMode ? "dark-mode-thead-tfoot" : ""}>
      <tr>
        <ExpenseTableHeader
          label={LABELS.ITEM}
          attribute="item"
          data={data}
          setData={setData}
          onClick={() => setSortedColumn("item")}
          sortedColumn={sortedColumn}
        />
        <ExpenseTableHeader
          label={LABELS.DATE}
          attribute="date"
          data={data}
          setData={setData}
          onClick={() => setSortedColumn("date")}
          sortedColumn={sortedColumn}
        />
        <ExpenseTableHeader
          label={LABELS.CATEGORY}
          attribute="category"
          data={data}
          setData={setData}
          onClick={() => setSortedColumn("category")}
          sortedColumn={sortedColumn}
        />
        <ExpenseTableHeader
          label={LABELS.COST}
          attribute="cost"
          data={data}
          setData={setData}
          onClick={() => setSortedColumn("cost")}
          sortedColumn={sortedColumn}
        />
        <th className="actions-column">
          {LABELS.ACTIONS}
        </th>
      </tr>
      </thead>
      <tbody>
        {data?.map(row => {
          if (shouldDisplayRow(row)) {
            total += Number(row.cost)
            return (
              <ExpenseRow key={row.key} row={row} openEditModal={openEditModal} />
            )
          }
        })}
      </tbody>
      <tfoot className={isDarkMode ? "dark-mode-thead-tfoot" : ""}>
      <tr>
        <td></td>
        <td></td>
        <td>{LABELS.TOTAL}</td>
        <td>{`$${total.toFixed(2)}`}</td>
        <td></td>
      </tr>
      </tfoot>
    </table>
  )
}
ExpenseTable = memo(ExpenseTable)
export default ExpenseTable
