import {useContext} from "react";
import {ExpenseKeysContext} from "./ExpenseKeysProvider";

function useExpenseKeys() {
  const context = useContext(ExpenseKeysContext)
  if (!context) {
    throw new Error("useExpenseKeys should only be used from within a (or child of a) ExpenseKeysProvider")
  }
  return context
}

export default useExpenseKeys