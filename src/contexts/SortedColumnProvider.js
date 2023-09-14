import {createContext, useState} from "react";

export const SortedColumnContext = createContext()

const SortedColumnProvider = (props) => {
  const [sortedColumn, setSortedColumn] = useState(null)

  return (
    <SortedColumnContext.Provider value={[sortedColumn, setSortedColumn]} {...props} />
  )
}

export default SortedColumnProvider
