const ACTION_COLUMN_INDEX: number = 4;

interface ExpenseData {
    item: string
    date: string
    category: string
    cost: string
}

interface MouseTarget {
    rowIndex: number
    targetCell: ParentNode
    targetElement: HTMLElement
    targetRow: HTMLTableRowElement
}

function getMouseTarget(e: MouseEvent): MouseTarget {
    const targetElement = e.target as HTMLElement
    const targetCell: ParentNode = targetElement.parentNode
    const targetRow = targetCell.parentNode as HTMLTableRowElement
    const rowIndex: number = targetRow.rowIndex
    return {
        rowIndex, targetCell, targetElement, targetRow
    }
}

function openAddExpenseModal(): void {
    const modal: HTMLElement = document.getElementById("add-expense-modal");
    modal.style.display = "block";
}

function closeAddExpenseModal(): void {
    const modal: HTMLElement = document.getElementById("add-expense-modal");
    modal.style.display = "none";

    const form = document.getElementById("add-expense-form") as HTMLFormElement;
    form.reset()
}

function openEditExpenseModal(): void {
    const modal: HTMLElement = document.getElementById("edit-expense-modal");
    modal.style.display = "block";
}

function closeEditExpenseModal(): void {
    const modal: HTMLElement = document.getElementById("edit-expense-modal");
    modal.style.display = "none";

    const form = document.getElementById("edit-expense-form") as HTMLFormElement;
    form.reset()
}

function updateTotal(): void {
    const table: HTMLCollectionOf<HTMLTableSectionElement> = document.getElementById("expenses-table").getElementsByTagName("tbody");
    const total: number = Array.from(table[0].rows).reduce((sum: number, row: HTMLTableRowElement): number => {
        if (row.style.display === "none") {
            return sum;
        }
        return sum + Number(row.cells[3].innerHTML.substring(1));
    }, 0);
    document.getElementById("total-expense-cell").innerHTML = `$${total.toFixed(2)}`;
}

function deleteRow(e: MouseEvent): void {
    if (confirm("Confirm deletion of expense?")) {
        const mouseTarget: MouseTarget = getMouseTarget(e)
        const expenseTable = document.getElementById("expenses-table") as HTMLTableElement
        expenseTable.deleteRow(mouseTarget.rowIndex);
        updateTotal();

        // delete from localStorage
        const key: string = mouseTarget.targetCell.parentElement.dataset.key;
        localStorage.removeItem(key);

        // delete key from allKeys
        const allKeys: string = localStorage.getItem("allKeys");
        if (allKeys === null) {
            return;
        }
        let allKeysArray: string[] = JSON.parse(allKeys);
        const keyIdx: number = allKeysArray.indexOf(key);
        if (keyIdx === -1) {
            return;
        }
        allKeysArray.splice(keyIdx, 1);
        localStorage.setItem("allKeys", JSON.stringify(allKeysArray));
    }
}

function editRow(e: MouseEvent): void {
    openEditExpenseModal()
    const form = document.getElementById("edit-expense-form") as HTMLFormElement;

    const mouseTarget: MouseTarget = getMouseTarget(e)

    form.dataset.rowIndex = String(mouseTarget.rowIndex);

    const rowCells: HTMLCollectionOf<HTMLTableCellElement> = mouseTarget.targetRow.cells;
    // set default values of edit expense modal to original values
    (<HTMLInputElement>document.getElementById("edit-item")).value = rowCells[0].textContent;
    (<HTMLInputElement>document.getElementById("edit-date")).value = rowCells[1].textContent;
    (<HTMLInputElement>document.getElementById("edit-category")).value = rowCells[2].textContent;
    (<HTMLInputElement>document.getElementById("edit-cost")).value = rowCells[3].textContent.substring(1);
}

function addExpenseRowToTable(table:  HTMLCollectionOf<HTMLTableSectionElement>, key: string, expenseData: ExpenseData): void {
    const newRow: HTMLTableRowElement = table[0].insertRow();
    newRow.dataset.key = key; // set data-key of html row

    const itemCell: HTMLTableCellElement = newRow.insertCell(0);
    const itemText: Text = document.createTextNode(expenseData.item);
    itemCell.appendChild(itemText);

    const dateCell: HTMLTableCellElement = newRow.insertCell(1);
    const dateText: Text = document.createTextNode(expenseData.date);
    dateCell.appendChild(dateText);

    const categoryCell: HTMLTableCellElement = newRow.insertCell(2);
    const categoryText: Text = document.createTextNode(expenseData.category);
    categoryCell.appendChild(categoryText);

    const costCell: HTMLTableCellElement = newRow.insertCell(3);
    const costText: Text = document.createTextNode(`$${Number(expenseData.cost).toFixed(2)}`);
    costCell.appendChild(costText);

    const actionsCell: HTMLTableCellElement = newRow.insertCell(4);
    const deleteImg: HTMLImageElement = document.createElement("img");
    deleteImg.src = "delete_black_18dp.svg";
    deleteImg.onclick = e => deleteRow(e);
    const editImg: HTMLImageElement = document.createElement("img");
    editImg.src = "edit_black_18dp.svg";
    editImg.onclick = e => editRow(e);
    actionsCell.append(deleteImg, editImg);
}

// when expense is edited
document.getElementById("confirm-edit-expense-button").addEventListener("click", e => {
    const expenseData: ExpenseData = {
        item: (<HTMLInputElement>document.getElementById("edit-item")).value,
        date: (<HTMLInputElement>document.getElementById("edit-date")).value,
        category: (<HTMLInputElement>document.getElementById("edit-category")).value,
        cost: (<HTMLInputElement>document.getElementById("edit-cost")).value
    }
    if (expenseData.item === "" || expenseData.date === "" || expenseData.cost === "") {
        alert("All fields are required!")
        return;
    }

    const rowIndex: number = Number(document.getElementById("edit-expense-form").dataset.rowIndex);
    const table: HTMLCollectionOf<HTMLTableSectionElement> = document.getElementById("expenses-table").getElementsByTagName("tbody");
    const tableRow: HTMLTableRowElement = table[0].rows[rowIndex-1];
    const rowCells: HTMLCollectionOf<HTMLTableCellElement> = tableRow.cells;
    rowCells[0].textContent = expenseData.item
    rowCells[1].textContent = expenseData.date;
    rowCells[2].textContent = expenseData.category;
    rowCells[3].textContent = `$${Number(expenseData.cost).toFixed(2)}`

    updateTotal();

    // after editing, remove sort icons
    const sortIcons = document.getElementsByClassName("sort-icons") as HTMLCollectionOf<HTMLSpanElement>;
    let iconSpan: HTMLSpanElement
    for (iconSpan of sortIcons) {
        iconSpan.style.visibility = "hidden";
    }

    closeEditExpenseModal();

    // edit localStorage
    const key: string = tableRow.dataset.key;
    localStorage.setItem(key, JSON.stringify({ key, ...expenseData }));
})

// when new expense is added
document.getElementById("confirm-add-expense-button").addEventListener("click", e => {
    const expenseData: ExpenseData = {
        item: (<HTMLInputElement>document.getElementById("item")).value,
        date: (<HTMLInputElement>document.getElementById("date")).value,
        category: (<HTMLInputElement>document.getElementById("category")).value,
        cost: (<HTMLInputElement>document.getElementById("cost")).value
    }
    if (expenseData.item === "" || expenseData.date === "" || expenseData.cost === "") {
        alert("All fields are required!")
        return;
    }

    const table: HTMLCollectionOf<HTMLTableSectionElement> = document.getElementById("expenses-table").getElementsByTagName("tbody");
    const key: string = Date.now().toString(); // unique key for expense item
    addExpenseRowToTable(table, key, expenseData);

    updateTotal();

    // after inserting, reset filters form
    (<HTMLFormElement>document.getElementById("filter-form")).reset();

    // after inserting, remove sort icons
    const sortIcons = document.getElementsByClassName("sort-icons") as HTMLCollectionOf<HTMLSpanElement>;
    let iconSpan: HTMLSpanElement
    for (iconSpan of sortIcons) {
        iconSpan.style.visibility = "hidden";
    }

    closeAddExpenseModal();

    // add expense to localStorage
    localStorage.setItem(key, JSON.stringify({ key, ...expenseData }));

    // append key to allKeys
    const allKeys: string = localStorage.getItem("allKeys");
    let allKeysArray: string[];
    if (allKeys === null) { // no entries exist
        allKeysArray = [];
    } else {
        allKeysArray = JSON.parse(allKeys);
    }
    allKeysArray.push(key);
    localStorage.setItem("allKeys", JSON.stringify(allKeysArray));
})

// filters
document.getElementById("filter-form").addEventListener("change", e => {
    const month: string = (<HTMLInputElement>document.getElementById("select-month")).value;
    const category: string = (<HTMLInputElement>document.getElementById("select-category")).value;
    const dateFrom: string = (<HTMLInputElement>document.getElementById("date-range-from")).value;
    const dateTo: string = (<HTMLInputElement>document.getElementById("date-range-to")).value;

    const table: HTMLCollectionOf<HTMLTableSectionElement> = document.getElementById("expenses-table").getElementsByTagName("tbody");

    Array.from(table[0].rows).forEach((row: HTMLTableRowElement): void => {
        const rowDate: Date = new Date(row.cells[1].innerHTML);
        const rowMonth: string = rowDate.toLocaleString('default', { month: 'long' });
        const rowCategory: string = row.cells[2].textContent;
        row.style.display =
            (month === "ALL" || rowMonth === month) &&
            (category === "ALL" || rowCategory === category) &&
            (dateFrom === "" || rowDate.getTime() >= Date.parse(dateFrom)) &&
            (dateTo === "" || rowDate.getTime() <= Date.parse(dateTo))
                ? "table-row"
                : "none";
    })

    // handle display of clear filters button
    const clearFiltersButton: HTMLElement = document.getElementById("clear-filters-button");
    if (month !== "ALL" || category !== "ALL" || dateFrom !== "" || dateTo !== "") {
        // display clear filters button
        clearFiltersButton.style.visibility = "visible";
    } else {
        // hide clear filters button
        clearFiltersButton.style.visibility = "hidden";
    }

    updateTotal();
})

document.getElementById("filter-form").addEventListener("reset", e => {
    const table: HTMLCollectionOf<HTMLTableSectionElement> = document.getElementById("expenses-table").getElementsByTagName("tbody");
    Array.from(table[0].rows).forEach((row: HTMLTableRowElement): void => {
        row.style.display = "table-row"
    });

    // reset date range
    const dateToSelector: HTMLElement = document.getElementById("date-range-to");
    dateToSelector.removeAttribute("min");
    const dateFromSelector: HTMLElement = document.getElementById("date-range-from");
    dateFromSelector.removeAttribute("max");

    // hide clear filters button
    const clearFiltersButton: HTMLElement = document.getElementById("clear-filters-button");
    clearFiltersButton.style.visibility = "hidden";

    updateTotal();
})

// set date range allowable selection
document.getElementById("date-range-from").addEventListener("change", e => {
    const dateToSelector: HTMLElement = document.getElementById("date-range-to");
    const dateInput = e.target as HTMLInputElement;
    dateToSelector.setAttribute("min", dateInput.value);
})

document.getElementById("date-range-to").addEventListener("change", e => {
    const dateFromSelector: HTMLElement = document.getElementById("date-range-from");
    const dateInput = e.target as HTMLInputElement;
    dateFromSelector.setAttribute("max", dateInput.value);
})


// sorting functionality using event delegation
document.getElementById("expenses-table").onclick = function(e) {
    const target = e.target as HTMLTableCellElement;
    if (target.tagName !== "TH") return; // not clicks on header
    if (target.cellIndex === ACTION_COLUMN_INDEX) return; // clicks on action column
    sortTable(target.cellIndex);
}

function sortTable(column: number) {
    const table: HTMLElement = document.getElementById("expenses-table");
    const tbody: HTMLTableSectionElement = table.querySelector("tbody");
    const rows: HTMLTableRowElement[] = Array.from(tbody.rows);

    // use dataset for custom data on whether column is sorted asc or desc
    const columnHeader: HTMLTableCellElement = document.getElementById("expenses-table").querySelector("thead").rows[0].cells[column];
    const sortOrder: string = columnHeader.dataset.sort;

    let compare: (a: HTMLTableRowElement, b: HTMLTableRowElement) => number;
    if (column === 3) { // cost column
        compare = (rowA, rowB) => {
            return (
                sortOrder === "desc"
                    ? Number(rowB.cells[column].innerHTML.substring(1)) - Number(rowA.cells[column].innerHTML.substring(1))
                    : Number(rowA.cells[column].innerHTML.substring(1)) - Number(rowB.cells[column].innerHTML.substring(1))
            );
        }
    } else { // string and date columns
        compare = (rowA, rowB) => {
            return (
                sortOrder === "desc"
                    ? rowA.cells[column].innerHTML > rowB.cells[column].innerHTML ? -1 : 1
                    : rowA.cells[column].innerHTML > rowB.cells[column].innerHTML ? 1 : -1
            );
        }
    }

    // display/hide sort icons
    const thead: HTMLCollectionOf<HTMLTableSectionElement> = table.getElementsByTagName("thead");
    const headerCells: HTMLCollectionOf<HTMLTableCellElement> = thead[0].rows[0].cells;
    for (let i: number = 0; i < headerCells.length - 1; i++) {
        const ascIcon = headerCells[i].getElementsByClassName("ascending") as HTMLCollectionOf<HTMLSpanElement>
        const descIcon = headerCells[i].getElementsByClassName("descending") as HTMLCollectionOf<HTMLSpanElement>
        if (i === column) { // display the sort icon
            descIcon[0].style.visibility = sortOrder === "desc" ? "visible" : "hidden";
            ascIcon[0].style.visibility = sortOrder === "desc" ? "hidden" : "visible";
        } else { // hide all sort icons
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
    const body: HTMLElement = document.body;
    body.classList.toggle("dark-mode");

    const header: HTMLTableSectionElement = document.getElementsByTagName("thead")[0];
    header.classList.toggle("dark-mode-thead-tfoot");
    const footer: HTMLTableSectionElement = document.getElementsByTagName("tfoot")[0];
    footer.classList.toggle("dark-mode-thead-tfoot");

    const modalContent: HTMLCollectionOf<Element> = document.getElementsByClassName("modal-content");
    Array.from(modalContent).forEach(modal => {
        modal.classList.toggle("dark-mode");
    })

    const images: HTMLCollectionOf<HTMLImageElement> = document.getElementsByTagName("img");
    Array.from(images).forEach(img => {
        if (img.style.filter) {
            img.style.removeProperty("filter"); // change to black
        } else {
            img.style.filter = "invert(100%)"; // change to white
        }
    })
})

// populate data from localStorage
document.addEventListener("DOMContentLoaded", e => {
    const allKeys: string = localStorage.getItem("allKeys");
    if (allKeys === null) {
        return;
    }
    const allKeysArr: string[] = JSON.parse(allKeys);

    const table: HTMLCollectionOf<HTMLTableSectionElement> = document.getElementById("expenses-table").getElementsByTagName("tbody");

    // add expenses from localStorage to table
    let key: string;
    for (key of allKeysArr) {
        const expenseData: ExpenseData = JSON.parse(localStorage.getItem(key));
        addExpenseRowToTable(table, key, expenseData)
    }

    updateTotal();
})
