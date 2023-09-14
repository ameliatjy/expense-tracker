import {memo} from "react";

let ArrowDownIcon = ({ visibility = "hidden" }) => {
  return (
    <svg style={{visibility: visibility, position: "absolute", right: 0}} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-360 280-560h400L480-360Z"/></svg>
  )
}
ArrowDownIcon = memo(ArrowDownIcon)
export default ArrowDownIcon