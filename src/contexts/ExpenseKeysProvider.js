import {createContext, useEffect, useState} from "react";

export const ExpenseKeysContext = createContext()

const ExpenseKeysProvider = (props) => {
  const [keys, setKeys] = useState(() => localStorage.getItem("allKeys") ?? JSON.stringify([]))

  useEffect(() => {
    localStorage.setItem("allKeys", keys)
  }, [keys]);

  return (
    <ExpenseKeysContext.Provider value={[keys, setKeys]} {...props} />
  )
}

export default ExpenseKeysProvider
