import Button from "../components/Button";
import {LABELS} from "../constants/labels";
import FilterForm from "../components/FilterForm";
import ExpenseTable from "../components/ExpenseTable";
import "../assets/styles.css"
import {useEffect, useState} from "react";
import Modal from "../components/Modal";
import useDarkMode from "../contexts/useDarkMode";
import useExpenseKeys from "../contexts/useExpenseKeys";
import useSortedColumn from "../contexts/useSortedColumn";

const Home = () => {
  const [displayAddExpenseModal, setDisplayAddExpenseModal] = useState(false)
  const [displayEditExpenseModal, setDisplayEditExpenseModal] = useState(false)
  const [editValues, setEditValues] = useState(null)
  const [filter, setFilter] = useState({})
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [keys, setKeys] = useExpenseKeys()
  const [isEdited, setIsEdited] = useState(false)
  const [, setSortedColumn] = useSortedColumn()
  console.log("rerender Home")

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
    setFilter({})

    // after inserting, remove sort
    setSortedColumn(null)

    // add expense to localStorage
    localStorage.setItem(key, JSON.stringify({ key, item, date, category, cost }));

    // append key to allKeys
    let allKeysArray = JSON.parse(keys);
    allKeysArray.push(key);
    setKeys(JSON.stringify(allKeysArray))

    // close modal
    setDisplayAddExpenseModal(false)
  }

  const openEditModal = row => {
    setDisplayEditExpenseModal(true)
    setEditValues(row)
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
    const key = editValues.key;
    localStorage.setItem(key, JSON.stringify({ key, item, date, category, cost}));

    // close modal
    setDisplayEditExpenseModal(false)
    setIsEdited(true)
  }

  return (
    <div id="home-container">
      <h1>{LABELS.HOMEPAGE_TITLE}</h1>
      <Button id="toggle-dark-mode-button" type="button" label={LABELS.TOGGLE_DARK_MODE} onClick={toggleDarkMode} />
      <div id="home-actions">
        <Button id="add-expense-button" type="button" label={LABELS.ADD_EXPENSE} onClick={() => setDisplayAddExpenseModal(true)} />
        <FilterForm filter={filter} setFilter={setFilter} />
      </div>
      {displayAddExpenseModal
        ? <Modal isAdd closeModal={() => setDisplayAddExpenseModal(false)} submit={addExpense} />
        : <></>
      }
      {displayEditExpenseModal
        ? <Modal isAdd={false} values={editValues} closeModal={() => setDisplayEditExpenseModal(false)} submit={editExpense} />
        : <></>
      }
      <ExpenseTable keys={keys} isEdited={isEdited} filter={filter} openEditModal={openEditModal} />
    </div>
  )
}

export default Home
