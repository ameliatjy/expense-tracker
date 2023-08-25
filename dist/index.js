const ACTION_COLUMN_INDEX = 4;
function getMouseTarget(e) {
    const targetElement = e.target;
    const targetCell = targetElement.parentNode;
    const targetRow = targetCell.parentNode;
    const rowIndex = targetRow.rowIndex;
    return {
        rowIndex, targetCell, targetElement, targetRow
    };
}
function openAddExpenseModal() {
    const modal = document.getElementById("add-expense-modal");
    modal.style.display = "block";
}
function closeAddExpenseModal() {
    const modal = document.getElementById("add-expense-modal");
    modal.style.display = "none";
    const form = document.getElementById("add-expense-form");
    form.reset();
}
function openEditExpenseModal() {
    const modal = document.getElementById("edit-expense-modal");
    modal.style.display = "block";
}
function closeEditExpenseModal() {
    const modal = document.getElementById("edit-expense-modal");
    modal.style.display = "none";
    const form = document.getElementById("edit-expense-form");
    form.reset();
}
function updateTotal() {
    const table = document.getElementById("expenses-table").getElementsByTagName("tbody");
    const total = Array.from(table[0].rows).reduce((sum, row) => {
        if (row.style.display === "none") {
            return sum;
        }
        return sum + Number(row.cells[3].innerHTML.substring(1));
    }, 0);
    document.getElementById("total-expense-cell").innerHTML = `$${total.toFixed(2)}`;
}
function deleteRow(e) {
    if (confirm("Confirm deletion of expense?")) {
        const mouseTarget = getMouseTarget(e);
        const expenseTable = document.getElementById("expenses-table");
        expenseTable.deleteRow(mouseTarget.rowIndex);
        updateTotal();
        // delete from localStorage
        const key = mouseTarget.targetCell.parentElement.dataset.key;
        localStorage.removeItem(key);
        // delete key from allKeys
        const allKeys = localStorage.getItem("allKeys");
        if (allKeys === null) {
            return;
        }
        let allKeysArray = JSON.parse(allKeys);
        const keyIdx = allKeysArray.indexOf(key);
        if (keyIdx === -1) {
            return;
        }
        allKeysArray.splice(keyIdx, 1);
        localStorage.setItem("allKeys", JSON.stringify(allKeysArray));
    }
}
function editRow(e) {
    openEditExpenseModal();
    const form = document.getElementById("edit-expense-form");
    const mouseTarget = getMouseTarget(e);
    form.dataset.rowIndex = String(mouseTarget.rowIndex);
    const rowCells = mouseTarget.targetRow.cells;
    // set default values of edit expense modal to original values
    document.getElementById("edit-item").value = rowCells[0].textContent;
    document.getElementById("edit-date").value = rowCells[1].textContent;
    document.getElementById("edit-category").value = rowCells[2].textContent;
    document.getElementById("edit-cost").value = rowCells[3].textContent.substring(1);
}
function addExpenseRowToTable(table, key, expenseData) {
    const newRow = table[0].insertRow();
    newRow.dataset.key = key; // set data-key of html row
    const itemCell = newRow.insertCell(0);
    const itemText = document.createTextNode(expenseData.item);
    itemCell.appendChild(itemText);
    const dateCell = newRow.insertCell(1);
    const dateText = document.createTextNode(expenseData.date);
    dateCell.appendChild(dateText);
    const categoryCell = newRow.insertCell(2);
    const categoryText = document.createTextNode(expenseData.category);
    categoryCell.appendChild(categoryText);
    const costCell = newRow.insertCell(3);
    const costText = document.createTextNode(`$${Number(expenseData.cost).toFixed(2)}`);
    costCell.appendChild(costText);
    const actionsCell = newRow.insertCell(4);
    const deleteImg = document.createElement("img");
    deleteImg.src = "delete_black_18dp.svg";
    deleteImg.onclick = e => deleteRow(e);
    const editImg = document.createElement("img");
    editImg.src = "edit_black_18dp.svg";
    editImg.onclick = e => editRow(e);
    actionsCell.append(deleteImg, editImg);
}
// when expense is edited
document.getElementById("confirm-edit-expense-button").addEventListener("click", e => {
    const expenseData = {
        item: document.getElementById("edit-item").value,
        date: document.getElementById("edit-date").value,
        category: document.getElementById("edit-category").value,
        cost: document.getElementById("edit-cost").value
    };
    if (expenseData.item === "" || expenseData.date === "" || expenseData.cost === "") {
        alert("All fields are required!");
        return;
    }
    const rowIndex = Number(document.getElementById("edit-expense-form").dataset.rowIndex);
    const table = document.getElementById("expenses-table").getElementsByTagName("tbody");
    const tableRow = table[0].rows[rowIndex - 1];
    const rowCells = tableRow.cells;
    rowCells[0].textContent = expenseData.item;
    rowCells[1].textContent = expenseData.date;
    rowCells[2].textContent = expenseData.category;
    rowCells[3].textContent = `$${Number(expenseData.cost).toFixed(2)}`;
    updateTotal();
    // after editing, remove sort icons
    const sortIcons = document.getElementsByClassName("sort-icons");
    let iconSpan;
    for (iconSpan of sortIcons) {
        iconSpan.style.visibility = "hidden";
    }
    closeEditExpenseModal();
    // edit localStorage
    const key = tableRow.dataset.key;
    localStorage.setItem(key, JSON.stringify(Object.assign({ key }, expenseData)));
});
// when new expense is added
document.getElementById("confirm-add-expense-button").addEventListener("click", e => {
    const expenseData = {
        item: document.getElementById("item").value,
        date: document.getElementById("date").value,
        category: document.getElementById("category").value,
        cost: document.getElementById("cost").value
    };
    if (expenseData.item === "" || expenseData.date === "" || expenseData.cost === "") {
        alert("All fields are required!");
        return;
    }
    const table = document.getElementById("expenses-table").getElementsByTagName("tbody");
    const key = Date.now().toString(); // unique key for expense item
    addExpenseRowToTable(table, key, expenseData);
    updateTotal();
    // after inserting, reset filters form
    document.getElementById("filter-form").reset();
    // after inserting, remove sort icons
    const sortIcons = document.getElementsByClassName("sort-icons");
    let iconSpan;
    for (iconSpan of sortIcons) {
        iconSpan.style.visibility = "hidden";
    }
    closeAddExpenseModal();
    // add expense to localStorage
    localStorage.setItem(key, JSON.stringify(Object.assign({ key }, expenseData)));
    // append key to allKeys
    const allKeys = localStorage.getItem("allKeys");
    let allKeysArray;
    if (allKeys === null) { // no entries exist
        allKeysArray = [];
    }
    else {
        allKeysArray = JSON.parse(allKeys);
    }
    allKeysArray.push(key);
    localStorage.setItem("allKeys", JSON.stringify(allKeysArray));
});
// filters
document.getElementById("filter-form").addEventListener("change", e => {
    const month = document.getElementById("select-month").value;
    const category = document.getElementById("select-category").value;
    const dateFrom = document.getElementById("date-range-from").value;
    const dateTo = document.getElementById("date-range-to").value;
    const table = document.getElementById("expenses-table").getElementsByTagName("tbody");
    Array.from(table[0].rows).forEach((row) => {
        const rowDate = new Date(row.cells[1].innerHTML);
        const rowMonth = rowDate.toLocaleString('default', { month: 'long' });
        const rowCategory = row.cells[2].textContent;
        row.style.display =
            (month === "ALL" || rowMonth === month) &&
                (category === "ALL" || rowCategory === category) &&
                (dateFrom === "" || rowDate.getTime() >= Date.parse(dateFrom)) &&
                (dateTo === "" || rowDate.getTime() <= Date.parse(dateTo))
                ? "table-row"
                : "none";
    });
    // handle display of clear filters button
    const clearFiltersButton = document.getElementById("clear-filters-button");
    if (month !== "ALL" || category !== "ALL" || dateFrom !== "" || dateTo !== "") {
        // display clear filters button
        clearFiltersButton.style.visibility = "visible";
    }
    else {
        // hide clear filters button
        clearFiltersButton.style.visibility = "hidden";
    }
    updateTotal();
});
document.getElementById("filter-form").addEventListener("reset", e => {
    const table = document.getElementById("expenses-table").getElementsByTagName("tbody");
    Array.from(table[0].rows).forEach((row) => {
        row.style.display = "table-row";
    });
    // reset date range
    const dateToSelector = document.getElementById("date-range-to");
    dateToSelector.removeAttribute("min");
    const dateFromSelector = document.getElementById("date-range-from");
    dateFromSelector.removeAttribute("max");
    // hide clear filters button
    const clearFiltersButton = document.getElementById("clear-filters-button");
    clearFiltersButton.style.visibility = "hidden";
    updateTotal();
});
// set date range allowable selection
document.getElementById("date-range-from").addEventListener("change", e => {
    const dateToSelector = document.getElementById("date-range-to");
    const dateInput = e.target;
    dateToSelector.setAttribute("min", dateInput.value);
});
document.getElementById("date-range-to").addEventListener("change", e => {
    const dateFromSelector = document.getElementById("date-range-from");
    const dateInput = e.target;
    dateFromSelector.setAttribute("max", dateInput.value);
});
// sorting functionality using event delegation
document.getElementById("expenses-table").onclick = function (e) {
    const target = e.target;
    if (target.tagName !== "TH")
        return; // not clicks on header
    if (target.cellIndex === ACTION_COLUMN_INDEX)
        return; // clicks on action column
    sortTable(target.cellIndex);
};
function sortTable(column) {
    const table = document.getElementById("expenses-table");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.rows);
    // use dataset for custom data on whether column is sorted asc or desc
    const columnHeader = document.getElementById("expenses-table").querySelector("thead").rows[0].cells[column];
    const sortOrder = columnHeader.dataset.sort;
    let compare;
    if (column === 3) { // cost column
        compare = (rowA, rowB) => {
            return (sortOrder === "desc"
                ? Number(rowB.cells[column].innerHTML.substring(1)) - Number(rowA.cells[column].innerHTML.substring(1))
                : Number(rowA.cells[column].innerHTML.substring(1)) - Number(rowB.cells[column].innerHTML.substring(1)));
        };
    }
    else { // string and date columns
        compare = (rowA, rowB) => {
            return (sortOrder === "desc"
                ? rowA.cells[column].innerHTML > rowB.cells[column].innerHTML ? -1 : 1
                : rowA.cells[column].innerHTML > rowB.cells[column].innerHTML ? 1 : -1);
        };
    }
    // display/hide sort icons
    const thead = table.getElementsByTagName("thead");
    const headerCells = thead[0].rows[0].cells;
    for (let i = 0; i < headerCells.length - 1; i++) {
        const ascIcon = headerCells[i].getElementsByClassName("ascending");
        const descIcon = headerCells[i].getElementsByClassName("descending");
        if (i === column) { // display the sort icon
            descIcon[0].style.visibility = sortOrder === "desc" ? "visible" : "hidden";
            ascIcon[0].style.visibility = sortOrder === "desc" ? "hidden" : "visible";
        }
        else { // hide all sort icons
            ascIcon[0].style.visibility = "hidden";
            descIcon[0].style.visibility = "hidden";
        }
    }
    rows.sort(compare);
    tbody.append(...rows);
    // modify data-sort of the header
    columnHeader.dataset.sort = columnHeader.dataset.sort === "desc" ? "asc" : "desc";
}
// dark/light mode feature
document.getElementById("toggle-dark-mode-button").addEventListener("click", e => {
    const body = document.body;
    body.classList.toggle("dark-mode");
    const header = document.getElementsByTagName("thead")[0];
    header.classList.toggle("dark-mode-thead-tfoot");
    const footer = document.getElementsByTagName("tfoot")[0];
    footer.classList.toggle("dark-mode-thead-tfoot");
    const modalContent = document.getElementsByClassName("modal-content");
    Array.from(modalContent).forEach(modal => {
        modal.classList.toggle("dark-mode");
    });
    const images = document.getElementsByTagName("img");
    Array.from(images).forEach(img => {
        if (img.style.filter) {
            img.style.removeProperty("filter"); // change to black
        }
        else {
            img.style.filter = "invert(100%)"; // change to white
        }
    });
});
// populate data from localStorage
document.addEventListener("DOMContentLoaded", e => {
    const allKeys = localStorage.getItem("allKeys");
    if (allKeys === null) {
        return;
    }
    const allKeysArr = JSON.parse(allKeys);
    const table = document.getElementById("expenses-table").getElementsByTagName("tbody");
    // add expenses from localStorage to table
    let key;
    for (key of allKeysArr) {
        const expenseData = JSON.parse(localStorage.getItem(key));
        addExpenseRowToTable(table, key, expenseData);
    }
    updateTotal();
});
