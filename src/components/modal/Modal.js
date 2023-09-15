import {memo, useRef} from "react";

import Button from "../button";
import InputField from "./components/InputField";
import SelectField from "../SelectField";

import useDarkMode from "../../hooks/useDarkMode";

import {BUTTON_LABELS} from "../button/constants";
import {MODAL_LABELS} from "./constants";
import {CATEGORIES} from "../../constants/categories";
import "../../styles/styles.css"

let Modal = ({ isAdd, closeModal, submit, values }) => {
  const isControlled = typeof values !== "undefined"
  const [isDarkMode, ] = useDarkMode()
  const formRef = useRef(null)
  console.log("rerender modal for " + isAdd ? "add expense" : "edit expense")

  return (
    <div className="modal">
      <div className={"modal-content " + (isDarkMode ? "dark-mode" : "")}>
        <div className="modal-header">
          <h2>{isAdd ? MODAL_LABELS.ADD_EXPENSE : MODAL_LABELS.EDIT_EXPENSE}</h2>
          <span onClick={() => closeModal()}>&times;</span>
        </div>

        <form ref={formRef} className="modal-form">
          <InputField
            label={MODAL_LABELS.ITEM_FIELD}
            type="text"
            defaultValue={isControlled ? values.item : undefined}
          />

          <InputField
            label={MODAL_LABELS.DATE_FIELD}
            type="date"
            defaultValue={isControlled ? values.date : undefined}
          />

          <SelectField
            label={MODAL_LABELS.CATEGORY_FIELD}
            values={CATEGORIES}
            selected={isControlled ? values.category : undefined}
            isAllAllowed={false}
          />

          <InputField
            label={MODAL_LABELS.COST_FIELD}
            type="number"
            defaultValue={isControlled ? values.cost : undefined}
          />

          <Button className="modal-confirm-button" type="button" onClick={() => submit(formRef.current)} label={isAdd ? BUTTON_LABELS.ADD : BUTTON_LABELS.SAVE_CHANGES} />
        </form>
      </div>
    </div>
  )
}
Modal = memo(Modal)
export {Modal}