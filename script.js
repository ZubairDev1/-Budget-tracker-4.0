// Get HTML elements
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const incomeRadio = document.getElementById('income');
const transactionsList = document.getElementById('transactions');
const balanceElement = document.getElementById('balance');

// Create an array to store transactions
let transactions = [];

// Function to clear stored transactions
function clearStoredTransactions() {
    // Clear transaction from local storage
    localStorage.removeItem('transactions');
    // Clear transactions array
    transactions = [];
    // Update transactions list in UI
    updateTransactionsList();
    calculateBalance();
    // Save the modified transactions to local storage
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }
  
  function removeTransaction(index) {
    transactions.splice(index, 1); // Remove the transaction at the specified index
    // Update transactions list in UI
    updateTransactionsList();
    calculateBalance();
    // Save the modified transactions to local storage
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }

// Load transactions from local storage (if available)
if (localStorage.getItem('transactions')) {
    transactions = JSON.parse(localStorage.getItem('transactions'));
    // Remove transactions older than 24 hours
    const currentTime = new Date().getTime();
    const twentyFourHoursAgo = currentTime - 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    transactions = transactions.filter(transaction => {
      return transaction.timestamp >= twentyFourHoursAgo;
    });
    updateTransactionsList();
    calculateBalance();
  }

// Function to add a new transaction
function addTransaction() {
 const description = descriptionInput.value;
 const amount = parseFloat(amountInput.value);
 const type = incomeRadio.checked ? 'income' : 'expense'

 if (description && amount) {
 const transaction = {
 description: description,
 amount: amount,
 type: type,
 timestamp: new Date().getTime() // Add timestamp
 };
 transactions.push(transaction);

 // Clear input fields
 descriptionInput.value = '';
 amountInput.value = '';

 // Update transactions list
 updateTransactionsList();

 // Calculate and display balance
 calculateBalance();

// Save transactions to local storage
localStorage.setItem('transactions', JSON.stringify(transactions));

 }
}

// Function to update transactions list
function updateTransactionsList() {
 transactionsList.innerHTML = '';
 transactions.forEach(transaction => {
 const listItem = document.createElement('li');
 listItem.textContent = `${transaction.description} - $${transaction.amount}`;
 listItem.classList.add(transaction.type);
 transactionsList.appendChild(listItem);
 });
}

// Function to calculate and display the balance
function calculateBalance() {
 let total = 0;
 transactions.forEach(transaction => {
 if (transaction.type === 'income') {
 total += transaction.amount;
 } else if (transaction.type === 'expense') {
 total -= transaction.amount;
 }
 });
 balanceElement.textContent = `$${total}`;

  // Update transaction history
  updateTransactionHistory();
  // Save transactions to local storage
  localStorage.setItem('transactions', JSON.stringify(transactions));

}

// Function to update transaction history
function updateTransactionHistory() {
    const transactionHistory = document.getElementById('transaction-history');
    transactionHistory.innerHTML = '';
    transactions.forEach((transaction, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${index + 1}. ${transaction.description} - $${transaction.amount}`;
      listItem.classList.add(transaction.type);
      const removeButton = document.createElement('button');
      removeButton.innerHTML = '<span style="font-size: 20px; font-weight: 50px;">&times;</span>';
      removeButton.addEventListener('click', () => removeTransaction(index));
      listItem.appendChild(removeButton);
      transactionHistory.appendChild(listItem);
    });
  }