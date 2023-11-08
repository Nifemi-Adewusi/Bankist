'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const AccountConstructor = function (owner, transactions, interestRate, pin) {
  this.owner = owner;
  this.transactions = transactions;
  this.interestRate = interestRate;
  this.pin = pin;
};
const account1 = new AccountConstructor(
  'Jonas Schmedtmann',
  [200, 450, -400, 3000, -650, -130, 70, 1300],
  1.2,
  1111
);

const account2 = new AccountConstructor(
  'Jessica Davis',
  [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  1.5,
  2222
);

const account3 = new AccountConstructor(
  'Steven Thomas Williams',
  [200, -200, 340, -300, -20, 50, 400, -460],
  0.7,
  3333
);

const account4 = new AccountConstructor(
  'Sarah Smith',
  [430, 1000, 700, 50, 90],
  1,
  4444
);

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
function currentUserTransactions(transactions, sort = false) {
  containerMovements.innerHTML = '';
  const sorted = sort
    ? transactions.slice().sort(function (a, b) {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
      })
    : transactions;
  sorted.forEach(function (transaction, transactionIndex) {
    const transactionType = transaction > 0 ? 'deposit' : 'withdrawal';
    const allTransactions = ` <div class="movements__row">
          <div class="movements__type movements__type--${transactionType}">${
      transactionIndex + 1
    } ${transactionType}</div>
          <div class="movements__date"></div>
          <div class="movements__value">${transaction}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', allTransactions);
  });
}

function createUserName(accArray) {
  accArray.forEach(function (acc) {
    const initials = acc.owner
      .split(' ')
      .map(function (value) {
        return value[0].toLowerCase();
      })
      .join('');
    return (acc.initials = initials);
  });
}

createUserName(accounts);

function calculateAllBalances(accs) {
  accs.forEach(function (acc) {
    const totalBalance = acc.transactions.reduce(function (
      accumulator,
      currentValue
    ) {
      return accumulator + currentValue;
    },
    0);
    acc.totalBalance = totalBalance;
    const totalDepositsArray = acc.transactions.filter(function (value) {
      return value > 0;
    });
    const totalWithdrawalsArray = acc.transactions.filter(function (value) {
      return value < 0;
    });
    acc.depositsArray = totalDepositsArray;
    acc.withdrawalArray = totalWithdrawalsArray;
    acc.totalDeposits = totalDepositsArray.reduce(function (
      accumulator,
      currentValue
    ) {
      return accumulator + currentValue;
    },
    0);
    acc.totalWithdrawals = totalWithdrawalsArray.reduce(function (
      accumulator,
      currentIndex
    ) {
      return accumulator + Math.abs(currentIndex);
    },
    0);
    acc.totalInterest = totalDepositsArray
      .map(function (value) {
        return (value * acc.interestRate) / 100;
      })
      .filter(function (value) {
        return value >= 1;
      })
      .reduce(function (accumulator, currentIndex) {
        return accumulator + currentIndex;
      }, 0);
  });
}

calculateAllBalances(accounts);

function getFirstName(user) {
  const userStr = user.split(' ');
  const firstIndex = userStr[0];
  const firstCharIndex = firstIndex[0].toUpperCase() + firstIndex.slice(1);
  return firstCharIndex;
}

function clearInputFields() {
  inputClosePin.value =
    inputCloseUsername.value =
    inputLoanAmount.value =
    inputLoginPin.value =
    inputLoginUsername.value =
    inputTransferAmount.value =
    inputTransferTo.value =
      '';
}

function hideUi() {
  containerApp.style.opacity = 0;
}

function logOut() {
  hideUi();
  labelWelcome.textContent = 'Log in to get started';
}

let currentUser;

function updateUi(currentUser) {
  containerApp.style.opacity = 1;
  labelBalance.textContent = `${currentUser.totalBalance}€`;
  labelSumIn.textContent = `${currentUser.totalDeposits}€`;
  labelSumOut.textContent = `${currentUser.totalWithdrawals}€`;
  labelSumInterest.textContent = `${currentUser.totalInterest}€`;
  labelWelcome.textContent = `Good Day, ${getFirstName(currentUser.owner)}`;
}

// Implementing Login.
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const userLoginInitials = inputLoginUsername.value.toLowerCase();
  const userLoginPin = Number(inputLoginPin.value);
  currentUser = accounts.find(function (account) {
    return (
      account.pin === userLoginPin && userLoginInitials === account.initials
    );
  });
  if (currentUser) {
    currentUserTransactions(currentUser.transactions);
    updateUi(currentUser);
    clearInputFields();
  } else {
    const matchingUser = accounts.find(function (account) {
      return account.initials === userLoginInitials;
    });
    if (typeof matchingUser === 'undefined') {
      labelWelcome.textContent = `Incorrect Username Or Password`;
      hideUi();
      clearInputFields();
    }
    if (matchingUser) {
      labelWelcome.textContent = 'Incorrect Password';
      hideUi();
      clearInputFields();
    }
  }
});

// Request Loan.
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const userLoanInput = Number(inputLoanAmount.value);
  clearInputFields();

  const loanValidity = currentUser.transactions.some(function (value) {
    return value >= userLoanInput * 0.1;
  });
  if (loanValidity) {
    setTimeout(function () {
      currentUser.transactions.push(userLoanInput);
      calculateAllBalances(accounts);
      updateUi(currentUser);
      currentUserTransactions(currentUser.transactions);
    }, 3000);
  } else {
    clearInputFields();
    alert(
      `${getFirstName(
        currentUser.owner
      )} Is Not Eligible For A Loan Of ${userLoanInput}`
    );
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const userTransferTo = inputTransferTo.value.toLowerCase();
  const amountToTransfer = Number(inputTransferAmount.value);
  const userToTransferTo = accounts.find(function (value) {
    return value.initials === userTransferTo;
  });
  console.log(userToTransferTo.initials);
  if (
    userToTransferTo &&
    userToTransferTo.initials === userTransferTo &&
    userTransferTo !== currentUser.initials &&
    currentUser.totalBalance >= amountToTransfer
  ) {
    currentUser.transactions.push(-amountToTransfer);
    userToTransferTo.transactions.push(amountToTransfer);
    calculateAllBalances(accounts);
    currentUserTransactions(currentUser.transactions);
    updateUi(currentUser);
    clearInputFields();
  }
});

// Closing Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const userCredentialsUserName = inputCloseUsername.value;
  const userCredentialsPin = Number(inputClosePin.value);
  console.log('Hello');
  if (
    currentUser.initials === userCredentialsUserName &&
    currentUser.pin === userCredentialsPin
  ) {
    console.log('Correct');
    const elementIndex = accounts.findIndex(function (value) {
      return value.pin === userCredentialsPin;
    });
    accounts.splice(elementIndex, 1);
    logOut();
  }
});

let isSorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  currentUserTransactions(currentUser.transactions, !isSorted);
  isSorted = !isSorted;
});
