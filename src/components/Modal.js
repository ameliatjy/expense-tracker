import Button from "./Button";
import {LABELS, MODAL_LABELS} from "../constants/labels";
import InputField from "./InputField";
import SelectField from "./SelectField";
import {CATEGORIES} from "../constants/categories";
import "../assets/styles.css"
import useDarkMode from "../contexts/useDarkMode";
import {memo, useRef} from "react";

let Modal = ({ isAdd, closeModal, submit, values }) => {
  const isControlled = typeof values !== "undefined"
  const [isDarkMode, ] = useDarkMode()
  const formRef = useRef(null)
  console.log("rerender modal for " + isAdd ? "add expense" : "edit expense")

  return (
    <div id="add-expense-modal" className="modal">
      <div id="add-modal-content" className={"modal-content " + (isDarkMode ? "dark-mode" : "")}>
        <div id="add-modal-header" className="modal-header">
          <h2>{isAdd ? LABELS.ADD_EXPENSE : LABELS.EDIT_EXPENSE}</h2>
          <span onClick={() => closeModal()}>&times;</span>
        </div>

        <form ref={formRef} className="modal-form">
          <InputField
            id="item"
            label={MODAL_LABELS.ITEM_FIELD}
            type="text"
            defaultValue={isControlled ? values.item : undefined}
          />

          <InputField
            id="date"
            label={MODAL_LABELS.DATE_FIELD}
            type="date"
            defaultValue={isControlled ? values.date : undefined}
          />

          <SelectField
            id="category"
            label={MODAL_LABELS.CATEGORY_FIELD}
            values={CATEGORIES}
            selected={isControlled ? values.category : undefined}
            isAllAllowed={false}
          />

          <InputField
            id="cost"
            label={MODAL_LABELS.COST_FIELD}
            type="number"
            defaultValue={isControlled ? values.cost : undefined}
          />

          <Button className="modal-confirm-button" type="button" onClick={() => submit(formRef.current)} label={isAdd ? LABELS.ADD : LABELS.SAVE_CHANGES} />
        </form>
      </div>
    </div>
  )
}
Modal = memo(Modal)
export default Modal