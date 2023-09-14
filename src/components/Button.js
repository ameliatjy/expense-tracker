import React from "react"

const Button = ({id, className, type, onClick, label}) => {
  return (
    <button id={id} className={className} type={type} onClick={onClick}>{label}</button>
  )
}

export default Button
