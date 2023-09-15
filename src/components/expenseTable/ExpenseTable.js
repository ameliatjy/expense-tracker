import {memo} from "react";

import ExpenseRow from "./components/ExpenseRow";
import ExpenseTableHeaderCell from "./components/ExpenseTableHeaderCell";

import useDarkMode from "../../hooks/useDarkMode";
import useSortedColumn from "../../hooks/useSortedColumn";

import {TABLE_HEADERS, TABLE_LABELS} from "./constants";
import "../../styles/styles.css"

let ExpenseTable = ({ data, dispatch, filter, openEditModal }) => {
  const [sortedColumn, setSortedColumn] = useSortedColumn()
  console.log("rerender expensetable")

  let total = 0
  const [isDarkMode, ] = useDarkMode()

  const shouldDisplayRow = row => {
    if (filter.month && filter.month !== new Date(row.date).toLocaleString('default', { month: 'long' })) {
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
              dispatch={dispatch}
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
