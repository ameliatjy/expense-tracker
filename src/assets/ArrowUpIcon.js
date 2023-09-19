import {memo} from "react";

let ArrowUpIcon = ({ visibility = "hidden" }) => {
  return (
    <svg style={{visibility: visibility, position: "absolute", right: 0}} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m280-400 200-200 200 200H280Z"/></svg>
  )
}
ArrowUpIcon = memo(ArrowUpIcon)
export default ArrowUpIcon
