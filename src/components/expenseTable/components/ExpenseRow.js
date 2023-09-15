import {memo} from "react";

import ActionsCell from "./ActionsCell";

let ExpenseRow = ({ row, openEditModal }) => {
  return (
    <tr>
      <td>{row.item}</td>
      <td>{row.date}</td>
      <td>{row.category}</td>
      <td>{`$${Number(row.cost).toFixed(2)}`}</td>
      <ActionsCell openEditModal={openEditModal} row={row} />
    </tr>
  )
}
ExpenseRow = memo(ExpenseRow)
export default ExpenseRow
