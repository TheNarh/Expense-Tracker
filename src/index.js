// we put all elements to be selected in an object to make it easier to access them
const ui = {
  balance: document.getElementById("balance"),
  income: document.getElementById("income"),
  expenses: document.getElementById("expenses"),
  incomeList: document.getElementById("income-list"),
  expenseList: document.getElementById("expense-list"),
  form: document.getElementById("transaction-form"),
  description: document.getElementById("description"),
  amount: document.getElementById("amount"),
  type: document.getElementById("type")
};

// store transactions
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// update UI
function updateUI() {
  let incomeTotal = 0;
  let expenseTotal = 0;

  // Clear old list items
  ui.incomeList.innerHTML = '';
  ui.expenseList.innerHTML = '';

  // Loop through transactions
  transactions.forEach(tx => {
    const li = document.createElement('li');
    li.classList.add(tx.type === 'income' ? "income-item" : "expense-item");

    // Transaction text
    const text = document.createElement('span');
    text.textContent = `${tx.description}: ${tx.type === 'income' ? '+' : '-'}$${tx.amount.toFixed(2)}`;

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "❌";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => {
      deleteTransaction(tx.id);
    });

    // Append elements
    li.appendChild(text);
    li.appendChild(deleteBtn);

    if (tx.type === 'income') {
      incomeTotal += tx.amount;
      ui.incomeList.appendChild(li);
    } else {
      expenseTotal += tx.amount;
      ui.expenseList.appendChild(li);
    }
  });

  // Update totals
  const balance = incomeTotal - expenseTotal;
  ui.income.textContent = `$${incomeTotal.toFixed(2)}`;
  ui.expenses.textContent = `$${expenseTotal.toFixed(2)}`;
  ui.balance.textContent = `$${balance.toFixed(2)}`;

  // Save to localStorage
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Delete transaction
function deleteTransaction(id) {
  transactions = transactions.filter(tx => tx.id !== id);
  updateUI();
}

// form submission handler
ui.form.addEventListener('submit', function(e) {
  e.preventDefault();

  // Get form values
  const description = ui.description.value.trim();
  const amount = Number(ui.amount.value);
  const type = ui.type.value;

  // Validation
  if (!description || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid description and amount.");
    return;
  }

  // Create transaction object
  const transaction = {
    id: Date.now(),
    description,
    amount,
    type,
  };

  // Save transaction
  transactions.push(transaction);

  // Reset form
  ui.form.reset();

  // Update UI
  updateUI();
});

// Load transactions on page load
updateUI();
