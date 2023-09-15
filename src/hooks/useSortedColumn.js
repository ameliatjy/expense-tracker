import {useContext} from "react";
import {SortedColumnContext} from "../contexts/SortedColumnProvider";

function useSortedColumn() {
  const context = useContext(SortedColumnContext)
  if (!context) {
    throw new Error("useSortedColumn should only be used from within a (or child of a) SortedColumnProvider")
  }
  return context
}

export default useSortedColumn
