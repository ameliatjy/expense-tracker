import "../../styles/styles.css"
import {memo, useEffect, useState} from "react";
import useDarkMode from "../../hooks/useDarkMode";
import ExpenseRow from "./components/ExpenseRow";
import ExpenseTableHeaderCell from "./components/ExpenseTableHeaderCell";
import useSortedColumn from "../../hooks/useSortedColumn";
import {TABLE_HEADERS, TABLE_LABELS} from "./constants";

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
    const allData = getData(keys)
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
        {TABLE_HEADERS.map(label => {
          const lowerCaseLabel = label.toLowerCase()
          return (
            <ExpenseTableHeaderCell
              label={label}
              attribute={lowerCaseLabel}
              data={data}
              setData={setData}
              onClick={() => setSortedColumn(lowerCaseLabel)}
              sortedColumn={sortedColumn}
            />
          )
        })}
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
        <td>{TABLE_LABELS.TOTAL}</td>
        <td>{`$${total.toFixed(2)}`}</td>
        <td></td>
      </tr>
      </tfoot>
    </table>
  )
}
ExpenseTable = memo(ExpenseTable)
export {ExpenseTable}
