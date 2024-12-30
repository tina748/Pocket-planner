const budget = document.getElementById("balance-amount");
const currentAmount = document.getElementById("currentAmount");
const expense = document.getElementById("expenseAmount");
const add_budget_btn = document.getElementById("addBudget");
const add_expense_btn = document.getElementById("addExpense");
const budgetFeild = document.getElementById("budgetAmount");
const expenseTitle = document.getElementById("expTitle");
const expenseDesc = document.getElementById("expDesc");
const expenseAmount = document.getElementById("expAmount");
const expenseList = document.getElementById("expenseList");
const deleteBtn = document.getElementById("delete");
const resetWindow = document.getElementById("reset");
const date = document.getElementById("date");
let budgetNumber = 0, expenseNumber = 0;
let expArray = [];
let arrOfItems = [];
let index = 0;

// Load data from localStorage on page load
window.addEventListener('load', () => {
    loadData();
});

// Function to create expense list item
const createExpenseList = (title, desc, amount, date) => {
    let item = document.createElement("li");
    item.className = 'item flex';

    item.innerHTML = `
        <div class="list-expense-title-desc text-ellises flex">
            <div class="flex fl-col list-text">
                <div class="list-expense-title">${title}</div>
                <div class="list-expense-desc">${desc}</div>
            </div>
            <div class="list-expense-amount flex fl-col">
                <span>${amount}</span>
                <div class="date">${date}</div>
            </div>
        </div>
        <button class="edit"><ion-icon name="create-outline"></ion-icon></button>
        <button class="delete">X</button>
    `;

    expenseList.appendChild(item);

    // Event listener for delete button
    item.querySelector(".delete").addEventListener('click', () => {
        item.remove();
        let expenditure = item.querySelector("span").innerText;

        budgetNumber = parseInt(budgetNumber) + parseInt(expenditure);
        expenseNumber = expenseNumber - parseInt(expenditure);
        expArray = [expenseNumber];

        currentAmount.innerText = `Rs ${parseInt(budgetNumber).toFixed(2)}`;
        expense.innerText = `Rs ${(expenseNumber).toFixed(2)}`;
        saveData();
    });

    // Event listener for edit button
    item.querySelector(".edit").addEventListener('click', () => {
        let flag = confirm("You want to edit the expense list?");
        if (flag) {
            let editedTitle = prompt("Please Enter the Title.", title);
            let editedDesc = prompt("Enter the Description.", desc);
            let editedAmount = +prompt("Please Enter the Amount.", amount);

            if (editedAmount < (budgetNumber + expenseNumber)) {
                item.querySelector(".list-expense-title").innerText = editedTitle;
                item.querySelector(".list-expense-desc").innerText = editedDesc;
                item.querySelector("span").innerText = editedAmount;

                budgetNumber = (budgetNumber + Number(amount)) - editedAmount;
                expenseNumber = (expenseNumber - Number(amount)) + editedAmount;
                expArray = [expenseNumber];
                currentAmount.innerText = `Rs ${Number(budgetNumber).toFixed(2)}`;
                expense.innerText = `Rs ${(expenseNumber).toFixed(2)}`;
                saveData();
            } else {
                alert("You don't have enough balance.");
            }
        }
    });
};

// Class to create the list data as an object
class List_data {
    constructor(title, desc, amount, date) {
        this.title = title;
        this.desc = desc;
        this.amount = amount;
        this.date = date;
    }
}

// Add Budget To Respective Fields 
add_budget_btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (budgetFeild.value > 0) {
        budget.innerText = `Rs ${Number(budgetFeild.value).toFixed(2)}`;
        currentAmount.innerText = `Rs ${Number(budgetFeild.value).toFixed(2)}`;
        budgetNumber = Number(budgetFeild.value);
        expenseAmount.innerText = 'Rs 00,00';
        expense.innerText = `Rs 00,000`;
        expArray.length = 0;
        saveData();
    } else {
        alert("Please Enter Your Budget Amount..");
    }
});

// Add Expense to Respective Fields 
add_expense_btn.addEventListener('click', (e) => {
    e.preventDefault();

    if (budget.innerText === "Rs 00,000.00") {
        alert("Please Add Budget First!");
    } else {
        if ((expenseTitle.value.length > 0 && expenseDesc.value.length > 0 && expenseAmount.value > 0 && date.value.length > 0)) {
            if (budgetNumber >= expenseAmount.value) {
                let expenseItem = new List_data(expenseTitle.value, expenseDesc.value, expenseAmount.value, date.value);
                arrOfItems.push(expenseItem);
                createExpenseList(arrOfItems[index].title, arrOfItems[index].desc, arrOfItems[index].amount, arrOfItems[index].date);
                expArray.push(Number(expenseAmount.value));
                index++;

                expenseNumber = Number(expenseAmount.value);
                saveData();
            }
            updateBudget();
            reset();
        }
    }
});

// Function To Calculate Budget and Expense:
const updateBudget = () => {
    if (budgetNumber >= expenseAmount.value) {
        let currentBalanceNumber = budgetNumber - expenseNumber;
        budgetNumber = currentBalanceNumber;
        let currentExpenceNumber = expArray.reduce((a, b) => a + b);
        expenseNumber = currentExpenceNumber;
        currentAmount.innerText = `Rs ${(currentBalanceNumber).toFixed(2)}`;
        expense.innerText = `Rs ${(currentExpenceNumber).toFixed(2)}`;
    } else {
        alert("You Don't Have Enough Balance");
    }
}

// Add Button To Reload Page
resetWindow.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

// Save data to localStorage
const saveData = () => {
    localStorage.setItem('budget', budgetNumber);
    localStorage.setItem('expenses', JSON.stringify(arrOfItems));
}

// Load data from localStorage
const loadData = () => {
    let savedBudget = localStorage.getItem('budget');
    let savedExpenses = localStorage.getItem('expenses');

    if (savedBudget) {
        budgetNumber = parseInt(savedBudget);
        budget.innerText = `Rs ${budgetNumber.toFixed(2)}`;
        currentAmount.innerText = `Rs ${budgetNumber.toFixed(2)}`;
    }

    if (savedExpenses) {
        arrOfItems = JSON.parse(savedExpenses);
        arrOfItems.forEach(item => {
            createExpenseList(item.title, item.desc, item.amount, item.date);
            expArray.push(Number(item.amount));
        });

        let totalExpenses = expArray.reduce((a, b) => a + b, 0);
        expenseNumber = totalExpenses;
        expense.innerText = `Rs ${totalExpenses.toFixed(2)}`;
        currentAmount.innerText = `Rs ${(budgetNumber - totalExpenses).toFixed(2)}`;
    }
}

// Reset Function
function reset() {
    budgetFeild.value = "";
    expenseAmount.value = "";
    expenseDesc.value = "";
    expenseTitle.value = "";
}
