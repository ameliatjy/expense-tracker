import DeleteIcon from "../../../assets/DeleteIcon";
import EditIcon from "../../../assets/EditIcon";
import useExpenseKeys from "../../../hooks/useExpenseKeys";
import {memo} from "react";

let ActionsCell = ({ openEditModal, row }) => {
  const [keys, setKeys] = useExpenseKeys()

  const deleteRow = () => {
    if (window.confirm("Confirm deletion of expense?")) {
      const key = row.key;
      localStorage.removeItem(key);

      // delete key from allKeys
      let allKeysArray = JSON.parse(keys);
      const keyIdx = allKeysArray.indexOf(key);
      if (keyIdx === -1) {
        return;
      }
      allKeysArray.splice(keyIdx, 1);
      setKeys(JSON.stringify(allKeysArray));
    }
  }
  return (
    <td>
      <DeleteIcon onClick={deleteRow} />
      <EditIcon onClick={() => openEditModal(row)} />
    </td>
  )
}
ActionsCell = memo(ActionsCell)
export default ActionsCell
