import {useContext} from "react";
import {DarkModeContext} from "./DarkModeProvider";

function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error("useDarkMode should only be used from within a (or child of a) DarkModeProvider")
  }
  return context
}

export default useDarkMode
