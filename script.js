'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
function displayTransactions(transactions, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? transactions.slice().sort((a, b) => a - b) : transactions;
  movs.forEach(function (transaction, transactionIndex) {
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

function getInitials(accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (personName) {
        return personName.at(0);
      })
      .join('');
  });
}

getInitials(accounts);

function hideUI() {
  labelWelcome.textContent = 'Login To Get Started';
  containerApp.style.opacity = 0;
  inputCloseUsername.value = inputClosePin.value = '';
}

function calculateBalances(accs) {
  accs.forEach(function (acc) {
    const totalBalance = acc.movements.reduce(function (
      accumulator,
      currentValue
    ) {
      return accumulator + currentValue;
    },
    0);
    acc.totalBalance = totalBalance;
    const deposits = acc.movements.filter(function (value) {
      return value > 0;
    });
    const withdrawals = acc.movements.filter(function (value) {
      return value < 0;
    });
    acc.deposits = deposits.reduce(function (accumulator, currentValue) {
      return accumulator + currentValue;
    }, 0);
    acc.withdrawals = withdrawals.reduce(function (accumulator, currentValue) {
      return accumulator + Math.abs(currentValue);
    }, 0);
    const totalInterest = deposits
      .map(function (value) {
        return (value * acc.interestRate) / 100;
      })
      .filter(function (value) {
        return value >= 1;
      })
      .reduce(function (accumulator, value) {
        return accumulator + value;
      }, 0);
    acc.totalInterest = totalInterest;
    acc.depositsArray = deposits;
  });
}

calculateBalances(accounts);

function getFirstName(personName) {
  const splittedName = personName.split(' ');
  return splittedName.at(0);
}

let currentUser;
function calcDisplaySummary(currentUser) {
  labelBalance.textContent = `${currentUser.totalBalance}€`;
  labelSumIn.textContent = `${currentUser.deposits}€`;
  labelSumOut.textContent = `${currentUser.withdrawals}€`;
  labelSumInterest.textContent = `${currentUser.totalInterest}€`;
  labelWelcome.textContent = `Good Day, ${getFirstName(currentUser.owner)}.`;
}
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const enteredUserName = inputLoginUsername.value;
  const enteredPin = Number(inputLoginPin.value);
  inputLoginUsername.value = inputLoginPin.value = '';

  currentUser = accounts.find(function (account) {
    if (account.userName === enteredUserName && account.pin === enteredPin) {
      return account;
    }
  });
  if (currentUser) {
    containerApp.style.opacity = 1;
    displayTransactions(currentUser.movements);
    calcDisplaySummary(currentUser);

    // Clear Input Field On Login.
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
  } else {
    const matchingUser = accounts.find(
      account => account.userName === enteredUserName.value
    );
    if (matchingUser) {
      labelWelcome.textContent = 'Incorrect Pin Entered';
    } else {
      labelWelcome.textContent = 'Incorrect Pin And User Name';
    }
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);

  const matchingCase = currentUser.movements.some(function (value) {
    if (value >= loanAmount * 0.1) {
      return true;
    }
  });
  if (matchingCase) {
    inputLoanAmount.value = '';

    setTimeout(function () {
      currentUser.movements.push(loanAmount);
      displayTransactions(currentUser.movements);
      calculateBalances(accounts);
      calcDisplaySummary(currentUser);
    }, 3000);
  } else {
    inputLoanAmount.value = '';

    alert("Sorry You're Not Eligible For A Loan");
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const userToTransferTo = inputTransferTo.value;
  const amountToSend = Number(inputTransferAmount.value);

  inputTransferTo.value = inputTransferAmount.value = '';
  const userDetails = accounts.find(function (account) {
    return account.userName === userToTransferTo;
  });
  console.log(userDetails);
  if (
    currentUser.totalBalance >= amountToSend &&
    userToTransferTo !== currentUser.userName &&
    userDetails &&
    amountToSend > 0
  ) {
    // Transfer the money to the other account.
    currentUser.movements.push(-amountToSend);
    userDetails.movements.push(amountToSend);

    calculateBalances(accounts);

    // Update the UI to display the new balances.
    displayTransactions(currentUser.movements);

    calcDisplaySummary(currentUser);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const confirmCloseUser = inputCloseUsername.value;
  const confirmUserPin = Number(inputClosePin.value);
  if (
    confirmCloseUser === currentUser.userName &&
    confirmUserPin === currentUser.pin
  ) {
    const accountToDelete = accounts.findIndex(function (value) {
      return value.userName === currentUser.userName;
    });
    // Delete the account
    accounts.splice(accountToDelete, 1);
    hideUI();
  }
});

// const allAccountMovements = accounts.map(function (acc) {
//   return acc.movements;
// });

// const totalMovements = allAccountMovements.flat();

// const totalUsersDeposits = totalMovements
//   .filter(function (acc) {
//     return acc > 0;
//   })
//   .reduce(function (accumulator, currentIndex) {
//     return accumulator + currentIndex;
//   }, 0);

// console.log(totalUsersDeposits);
// const totalUserMoneySent = totalMovements
//   .filter(function (acc) {
//     return acc < 0;
//   })
//   .reduce(function (accumulator, currentIndex) {
//     return accumulator + Math.abs(currentIndex);
//   });

// console.log(totalUserMoneySent);

let isSorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayTransactions(currentUser.movements, !isSorted);
  isSorted = !isSorted;
});

const allAccountMovements = accounts.flatMap(function (acc) {
  return acc.movements;
});

const totalBankDeposits = allAccountMovements
  .filter(acc => acc > 0)
  .reduce((accumulator, currentIndex) => accumulator + currentIndex, 0);

// console.log(totalBankDeposits);

const totalWithdrawals = allAccountMovements
  .filter(acc => acc < 0)
  .reduce(
    (accumulator, currentIndex) => accumulator + Math.abs(currentIndex),
    0
  );
// console.log(totalWithdrawals);

const usingReduce = allAccountMovements.reduce(
  function (accumulator, currentIndex) {
    currentIndex < 0
      ? (accumulator.withdrawals += currentIndex)
      : (accumulator.deposits += currentIndex);
    return accumulator;
  },
  { deposits: 0, withdrawals: 0 }
);

console.log(usingReduce);
const minAndMaximumAmountDeposited = allAccountMovements.reduce(
  function (accumulator, currentIndex) {
    if (currentIndex > accumulator.max) {
      accumulator.max = currentIndex;
    }
    if (currentIndex < accumulator.min) {
      accumulator.min = currentIndex;
    }
    return accumulator;
  },
  { max: 0, min: 0 }
);

console.log(allAccountMovements);
console.log(minAndMaximumAmountDeposited);

const testArray = [10, 3, 26, 18, 2, 1, 9, 27, 6];
const minMax = testArray.reduce(
  function (accumulator, currentValue) {
    if (currentValue > accumulator.max) {
      accumulator.max = currentValue;
    }
    if (currentValue < accumulator.min) {
      accumulator.min = currentValue;
    }
  },
  {
    min: 0,
    max: 0,
  }
);
console.log("hey")
console.log(minMax);
