import {useReducer} from "react";
import {HOME_PAGE_ACTION_TYPES} from "../pages/home/constants";

let homePageReducer = (state, action) => {
  switch (action.type) {
    case HOME_PAGE_ACTION_TYPES.TOGGLE_ADD_EXPENSE_MODAL: {
      return { ...state, displayAddExpenseModal: !state.displayAddExpenseModal }
    }
    case HOME_PAGE_ACTION_TYPES.TOGGLE_EDIT_EXPENSE_MODAL: {
      return { ...state, displayEditExpenseModal: !state.displayEditExpenseModal, editValues: action.editValues }
    }
    case HOME_PAGE_ACTION_TYPES.SUBMIT_EDIT_EXPENSE: {
      return { ...state, isEdited: true }
    }
    case HOME_PAGE_ACTION_TYPES.RESET_FILTER: {
      return { ...state, filter: {} }
    }
    case HOME_PAGE_ACTION_TYPES.ADD_FILTER: {
      return { ...state, filter: { ...state.filter, ...action.filter } }
    }
    case HOME_PAGE_ACTION_TYPES.REMOVE_FILTER: {
      const { [action.fieldName]: a, ...others } = state.filter
      return { ...state, filter: others }
    }
    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}

let useHomePageState = () => {
  const [state, reducer] = useReducer(homePageReducer, {
    displayAddExpenseModal: false,
    displayEditExpenseModal: false,
    editValues: null,
    filter: {},
    isEdited: false,
  })
  return [state, reducer]
}

export default useHomePageState
