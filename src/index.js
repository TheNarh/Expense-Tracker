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
  type: document.getElementById("type"),
  submitBtn: document.querySelector("#transaction-form button[type='submit']") 
};

// store transactions
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editId = null; // 
let cancelBtn = null; // 
let originalTx = null; //

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

    // Edit button 🔹
    const editBtn = document.createElement('button');
    editBtn.textContent = "✏️";
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener("click", () => {
      editTransaction(tx.id);
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "❌";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => {
      deleteTransaction(tx.id);
    });

    // Append elements
    li.appendChild(text);
    li.appendChild(editBtn);  
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

// Edit transaction 🔹
function editTransaction(id) {
  const tx = transactions.find(t => t.id === id);
  if (!tx) return;

  // Pre-fill form with transaction data
  ui.description.value = tx.description;
  ui.amount.value = tx.amount;
  ui.type.value = tx.type;

  // Store original for comparison 
  originalTx = { ...tx };

  // Set edit mode
  editId = id;
  ui.submitBtn.textContent = "Update Transaction";
  ui.submitBtn.disabled = true; 

  // Add cancel button if not already there
  if (!cancelBtn) {
    cancelBtn = document.createElement("button");
    cancelBtn.type = "button"; 
    cancelBtn.textContent = "Cancel";
    cancelBtn.classList.add("cancel-btn");
    cancelBtn.addEventListener("click", cancelEdit);
    ui.form.appendChild(cancelBtn);
  }

  // Watch inputs for changes
  ["input", "change"].forEach(evt => {
    ui.description.addEventListener(evt, checkFormChanges);
    ui.amount.addEventListener(evt, checkFormChanges);
    ui.type.addEventListener(evt, checkFormChanges);
  });
}

// Cancel editing
function cancelEdit() {
  editId = null;
  originalTx = null;
  ui.form.reset();
  ui.submitBtn.textContent = "Add Transaction";
  ui.submitBtn.disabled = false;

  if (cancelBtn) {
    cancelBtn.remove(); // remove button from DOM
    cancelBtn = null;
  }
}

// Check if form values differ from original
function checkFormChanges() {
  if (!originalTx) return;

  const hasChanged =
    ui.description.value.trim() !== originalTx.description ||
    Number(ui.amount.value) !== originalTx.amount ||
    ui.type.value !== originalTx.type;

  ui.submitBtn.disabled = !hasChanged;
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

  if (editId) {
    // Update existing transaction
    transactions = transactions.map(tx =>
      tx.id === editId ? { ...tx, description, amount, type } : tx
    );

    // Reset edit mode
    editId = null;
    originalTx = null;
    ui.submitBtn.textContent = "Add Transaction";
    ui.submitBtn.disabled = false;

    if (cancelBtn) {
      cancelBtn.remove();
      cancelBtn = null;
    }
  } else {
    // Create new transaction
    const transaction = {
      id: Date.now(),
      description,
      amount,
      type,
    };
    transactions.push(transaction);
  }

  // Reset form
  ui.form.reset();

  // Update UI
  updateUI();
});

// Load transactions on page load
updateUI();