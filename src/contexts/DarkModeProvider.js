import {createContext, useState} from "react";

export const DarkModeContext = createContext()

const DarkModeProvider = (props) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    console.log("toggleDarkMode")
    setIsDarkMode(d => !d)
    document.body.classList.toggle("dark-mode")
  }

  return (
    <DarkModeContext.Provider value={[isDarkMode, toggleDarkMode]} {...props} />
  )
}

export default DarkModeProvider
