let incomeCart = [];
let expenseCart = [];
let incomeName = document.getElementById("incomeName");
let incomeAmount = document.getElementById("incomeAmount");
let expenseName = document.getElementById("expenseName");
let expenseAmount = document.getElementById("expenseAmount");
let totalAmt = document.getElementById("total-amount");
let formOne = document.getElementById("income-form");
let formTwo = document.getElementById("expense-form");
let date = new Date().toDateString();

formOne.addEventListener("submit", async (e) => {
  e.preventDefault();
  let incomeNameValue = incomeName.value;
  let incomeAmountValue = parseFloat(incomeAmount.value);

  if (incomeNameValue.trim() === "") {
    alert("Please enter a valid income source");
    return;
  }

  if (isNaN(incomeAmountValue) || incomeAmountValue < 0) {
    alert("Income amount must  >= 0");
    return;
  }

  if (!isNaN(incomeAmountValue) && incomeAmountValue > 0) {
    const date = new Date().toDateString();
    incomeCart.push({
      type: "income",
      name: incomeNameValue,
      amount: incomeAmountValue,
      date: date,
    });

    await addTransaction("income", incomeNameValue, incomeAmountValue, date);

    incomeName.value = "";
    incomeAmount.value = "";

    updateDifference();
    funTable();
  }
});

formTwo.addEventListener("submit", async (e) => {
  e.preventDefault();
  let expenseNameValue = expenseName.value;
  let expenseAmountValue = parseFloat(expenseAmount.value);

  if (expenseNameValue.trim() === "") {
    alert("Please enter a valid expense source");
    return;
  }

  if (isNaN(expenseAmountValue) || expenseAmountValue < 0) {
    alert("Expense amount must  >= 0");
    return;
  }
  if (!isNaN(expenseAmountValue) && expenseAmountValue > 0) {
    const date = new Date().toDateString();
    expenseCart.push({
      type: "expense",
      name: expenseNameValue,
      amount: expenseAmountValue,
      date: date,
    });

    await addTransaction("expense", expenseNameValue, expenseAmountValue, date);

    expenseName.value = "";
    expenseAmount.value = "";

    updateDifference();
    funTable();
  }
});

function calculateDifference() {
  let incomeTotal = incomeCart.reduce((total, item) => total + item.amount, 0);
  let expenseTotal = expenseCart.reduce(
    (total, item) => total + item.amount,
    0
  );
  return incomeTotal - expenseTotal;
}

function funTable() {
  let transList = document.getElementById("transaction-list");

  transList.innerHTML = "";


  for (let i = incomeCart.length - 1; i >= 0; i--) {
    const item = incomeCart[i];
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="background-color:#52D768;font-size:20px">${item.date}</td>
      <td style="background-color:#52D768;font-size:20px">${item.name}</td>
      <td style="background-color:#52D768;font-size:20px">₹${item.amount}</td>
    `;
    transList.appendChild(tr);
  }


  for (let i = expenseCart.length - 1; i >= 0; i--) {
    const item = expenseCart[i];
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="background-color:#FB3D39;font-size:20px;color:white">${item.date}</td>
      <td style="background-color:#FB3D39;font-size:20px;color:white">${item.name}</td>
      <td style="background-color:#FB3D39;font-size:20px;color:white">₹${item.amount}</td>
    `;
    transList.appendChild(tr);
  }
}

//Backend by ad007
async function displayTransactions() {
  try {
    const response = await fetch("http://localhost:3000/api/transactions");

    if (response.ok) {
      const transactions = await response.json();
      const transList = document.getElementById("transaction-list");
      transList.innerHTML = "";

      transactions.forEach((item) => {
        if (item.type === "income") {
          incomeCart.push(item);
        } else {
          expenseCart.push(item);
        }

        let tr = document.createElement("tr");
        let bgColor = item.type === "income" ? "#52D768" : "#FB3D39";
        tr.innerHTML = `
          <td style="background-color: ${bgColor}">${item.date}</td>
          <td style="background-color: ${bgColor}">${item.name}</td>
          <td style="background-color: ${bgColor}">$${item.amount}</td>
        `;
        transList.appendChild(tr);
      });

      updateDifference();
      funTable();
    } else {
      console.error("Error fetching transactions:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
}
async function addTransaction(type, name, amount) {
  try {
    const date = new Date().toDateString();
    const response = await fetch("http://localhost:3000/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, name, amount, date }),
    });

    if (response.ok) {
      console.log("Transaction added successfully");
    } else {
      console.error("Error adding transaction:", response.statusText);
    }
  } catch (error) {
    console.error("Error adding transaction:", error);
  }
}

function updateDifference() {
  let difference = calculateDifference();
  totalAmt.innerHTML = `The total amount remaining:  ₹${difference}`;
}

window.addEventListener("load", () => {
  displayTransactions();
});
