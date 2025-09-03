// ✅ Centralized UI references
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
  category: document.getElementById("category"),
  submitBtn: document.querySelector("#transaction-form button[type='submit']"),
};

// ✅ Category colors
const categoryColors = {
  Food: "orange",
  Transport: "blue",
  Rent: "gray",
  Shopping: "purple",
  Salary: "green",
  Other: "black",
};

// ✅ State
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editId = null;
let cancelBtn = null;
let originalTx = null;

// ✅ Render a single transaction
function renderTransaction(tx) {
  const li = document.createElement("li");
  li.classList.add(tx.type === "income" ? "income-item" : "expense-item");

  // transaction text
  const text = document.createElement("span");
  text.innerHTML = `
    ${tx.description} 
    <span style="color:${categoryColors[tx.category] || "black"}; font-weight:600;">
      [${tx.category}]
    </span>
    - ${tx.date}
    : ${tx.type === "income" ? "+" : "-"}$${tx.amount.toFixed(2)}
  `;

  // edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  editBtn.classList.add("edit-btn");
  editBtn.addEventListener("click", () => editTransaction(tx.id));

  // delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", () => deleteTransaction(tx.id));

  li.appendChild(text);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);

  return li;
}

// ✅ Update UI
function updateUI(searchQuery = "", filterCategory = "All") {
  let incomeTotal = 0;
  let expenseTotal = 0;

  ui.incomeList.innerHTML = "";
  ui.expenseList.innerHTML = "";

  transactions
    .filter((tx) => {
      // search filter
      const matchesSearch = tx.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      // category filter
      const matchesCategory =
        filterCategory === "All" || tx.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .forEach((tx) => {
      const li = renderTransaction(tx);

      if (tx.type === "income") {
        incomeTotal += tx.amount;
        ui.incomeList.appendChild(li);
      } else {
        expenseTotal += tx.amount;
        ui.expenseList.appendChild(li);
      }
    });

  // update totals
  const balance = incomeTotal - expenseTotal;
  ui.income.textContent = `$${incomeTotal.toFixed(2)}`;
  ui.expenses.textContent = `$${expenseTotal.toFixed(2)}`;
  ui.balance.textContent = `$${balance.toFixed(2)}`;

  // save state
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// ✅ Delete transaction
function deleteTransaction(id) {
  transactions = transactions.filter((tx) => tx.id !== id);
  updateUI();
}

// ✅ Edit transaction
function editTransaction(id) {
  const tx = transactions.find((t) => t.id === id);
  if (!tx) return;

  ui.description.value = tx.description;
  ui.amount.value = tx.amount;
  ui.type.value = tx.type;
  ui.category.value = tx.category;

  originalTx = { ...tx };
  editId = id;
  ui.submitBtn.textContent = "Update Transaction";
  ui.submitBtn.disabled = true;

  if (!cancelBtn) {
    cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.textContent = "Cancel";
    cancelBtn.classList.add("cancel-btn");
    cancelBtn.addEventListener("click", cancelEdit);
    ui.form.appendChild(cancelBtn);
  }

  ["input", "change"].forEach((evt) => {
    ui.description.addEventListener(evt, checkFormChanges);
    ui.amount.addEventListener(evt, checkFormChanges);
    ui.type.addEventListener(evt, checkFormChanges);
    ui.category.addEventListener(evt, checkFormChanges);
  });
}

// ✅ Cancel edit mode
function cancelEdit() {
  editId = null;
  originalTx = null;
  ui.form.reset();
  ui.submitBtn.textContent = "Add Transaction";
  ui.submitBtn.disabled = false;

  if (cancelBtn) {
    cancelBtn.remove();
    cancelBtn = null;
  }
}

// ✅ Check if form has changed
function checkFormChanges() {
  if (!originalTx) return;

  const hasChanged =
    ui.description.value.trim() !== originalTx.description ||
    Number(ui.amount.value) !== originalTx.amount ||
    ui.type.value !== originalTx.type ||
    ui.category.value !== originalTx.category;

  ui.submitBtn.disabled = !hasChanged;
}

// ✅ Form submission
ui.form.addEventListener("submit", function (e) {
  e.preventDefault();

  const description = ui.description.value.trim();
  const amount = Number(ui.amount.value);
  const type = ui.type.value;
  const category = ui.category.value;

  if (!description || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid description and amount.");
    return;
  }

  if (editId) {
    // update
    transactions = transactions.map((tx) =>
      tx.id === editId
        ? { ...tx, description, amount, type, category }
        : tx
    );
    editId = null;
    originalTx = null;
    ui.submitBtn.textContent = "Add Transaction";
    ui.submitBtn.disabled = false;
    if (cancelBtn) {
      cancelBtn.remove();
      cancelBtn = null;
    }
  } else {
    // create new
    const transaction = {
      id: Date.now(),
      description,
      amount,
      type,
      category,
      date: new Date().toISOString().split("T")[0],
    };
    transactions.push(transaction);
  }

  ui.form.reset();
  updateUI();
});

// ✅ Load initial state
updateUI();
