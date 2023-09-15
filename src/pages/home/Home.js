import {memo, useEffect, useMemo} from "react";

import Button from "../../components/button";
import FilterForm from "../../components/filterForm";
import ExpenseTable from "../../components/expenseTable";
import Modal from "../../components/modal";

import useDarkMode from "../../hooks/useDarkMode";
import useExpenseKeys from "../../hooks/useExpenseKeys";
import useSortedColumn from "../../hooks/useSortedColumn";
import useHomePageState from "../../hooks/useHomePageState";

import {BUTTON_LABELS} from "../../components/button/constants";
import {LABELS} from "../../constants/labels";
import {HOME_PAGE_ACTION_TYPES} from "./constants";
import "../../styles/styles.css"

function getData(keys) {
  if (keys === null) {
    return;
  }
  const keysArr = JSON.parse(keys);
  const allData = []
  for (const key of keysArr) {
    allData.push(JSON.parse(localStorage.getItem(key)));
  }
  return allData
}

let Home = () => {
  const [state, dispatch] = useHomePageState()

  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [keys, setKeys] = useExpenseKeys()
  const [, setSortedColumn] = useSortedColumn()
  console.log("rerender Home")
  const data = useMemo(() => getData(keys), [keys, state.isEdited, state.filter])

  useEffect(() => {
    const images = document.getElementsByTagName("svg");
    Array.from(images).forEach(img => {
      if (img.style.filter) {
        img.style.removeProperty("filter"); // change to black
      } else {
        img.style.filter = "invert(100%)"; // change to white
      }
    })
  }, [isDarkMode]);

  const addExpense = formRef => {
    const item = formRef[0].value;
    const date = formRef[1].value;
    const category = formRef[2].value;
    const cost = formRef[3].value;
    if (item === "" || date === "" || cost === "") {
      alert("All fields are required!")
      return;
    }

    const key = Date.now().toString(); // unique key for expense item

    // after inserting, reset filters form
    document.getElementById("filter-form").reset();
    dispatch({ type: HOME_PAGE_ACTION_TYPES.RESET_FILTER })

    // after inserting, remove sort
    setSortedColumn(null)

    // add expense to localStorage
    localStorage.setItem(key, JSON.stringify({ key, item, date, category, cost }));

    // append key to allKeys
    let allKeysArray = JSON.parse(keys);
    allKeysArray.push(key);
    setKeys(JSON.stringify(allKeysArray))

    // close modal
    dispatch({ type: HOME_PAGE_ACTION_TYPES.TOGGLE_ADD_EXPENSE_MODAL })
  }

  const openEditModal = row => {
    dispatch({ type: HOME_PAGE_ACTION_TYPES.TOGGLE_EDIT_EXPENSE_MODAL, editValues: row })
  }

  const editExpense = formRef => {
    const item = formRef[0].value;
    const date = formRef[1].value;
    const category = formRef[2].value;
    const cost = formRef[3].value;
    if (item === "" || date === "" || cost === "") {
      alert("All fields are required!")
      return;
    }

    // after editing, remove sort
    setSortedColumn(null)

    // edit localStorage
    const key = state.editValues.key;
    localStorage.setItem(key, JSON.stringify({ key, item, date, category, cost}));

    // close modal
    dispatch({ type: HOME_PAGE_ACTION_TYPES.TOGGLE_EDIT_EXPENSE_MODAL })
    dispatch({ type: HOME_PAGE_ACTION_TYPES.SUBMIT_EDIT_EXPENSE })
  }

  return (
    <div id="home-container">
      <h1>{LABELS.HOMEPAGE_TITLE}</h1>
      <Button id="toggle-dark-mode-button" type="button" label={BUTTON_LABELS.TOGGLE_DARK_MODE} onClick={toggleDarkMode} />
      <div id="home-actions">
        <Button
          id="add-expense-button"
          type="button"
          label={BUTTON_LABELS.ADD_EXPENSE}
          onClick={() => dispatch({ type: HOME_PAGE_ACTION_TYPES.TOGGLE_ADD_EXPENSE_MODAL })}
        />
        <FilterForm filter={state.filter} dispatch={dispatch} />
      </div>
      {state.displayAddExpenseModal
        ? <Modal isAdd closeModal={() => dispatch({ type: HOME_PAGE_ACTION_TYPES.TOGGLE_ADD_EXPENSE_MODAL })} submit={addExpense} />
        : <></>
      }
      {state.displayEditExpenseModal
        ? <Modal isAdd={false} values={state.editValues} closeModal={() => dispatch({ type: HOME_PAGE_ACTION_TYPES.TOGGLE_EDIT_EXPENSE_MODAL })} submit={editExpense} />
        : <></>
      }
      <ExpenseTable data={state.sortFn === null ? data : data.toSorted(state.sortFn)} dispatch={dispatch} filter={state.filter} openEditModal={openEditModal} />
    </div>
  )
}
Home = memo(Home)
export {Home}
