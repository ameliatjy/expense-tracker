import React, {memo} from "react"

let Button = ({id, className, type, onClick, label}) => {
  return (
    <button id={id} className={className} type={type} onClick={onClick}>{label}</button>
  )
}
Button = memo(Button)
export {Button}
