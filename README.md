# Expense-Tracker
A tracker to track expenses of the user

This Expense Tracker outlines the logical flow of how the application manages user data, from adding new transactions to updating the dashboard in real time.

When the user first loads the app, it checks for any existing records in localStorage first. If data exists, it loads and displays all previous transactions. Otherwise, it initializes an empty dataset.

Users can then perform three main actions:

Add a Transaction – Input income or expense details which are validated and saved to localStorage. The UI updates automatically to reflect the new balance and totals.

Delete a Transaction – Select and remove an entry from the list, which updates both the stored data and displayed figures.

View Summary – See a visual summary of income and expenses, with optional filters by category or date.

This application continuously keeps the displayed balance, total income, and total expenses in sync with stored data, ensuring accurate financial tracking.

<img width="625" height="897" alt="Expense Tracker FlowChart" src="https://github.com/user-attachments/assets/7eaebe4e-2847-4080-a666-4220298b0e6e" />
