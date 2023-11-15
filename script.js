'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// ₦
const account1 = {
  owner: 'Nifemi Adewusi',
  transactions: [
    200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300, 10000, 3000,
    24000, -2134, -90000, 200000,
  ],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2023-09-08T14:11:59.604Z',
    '2023-10-05T17:01:17.194Z',
    '2023-11-06T23:36:17.929Z',
    '2023-11-08T10:51:36.790Z',
    '2023-11-08T10:51:36.790Z',
    '2023-11-08T10:51:36.790Z',
    '2023-11-08T10:51:36.790Z',
    '2023-11-08T10:51:36.790Z',
    '2023-11-08T10:51:36.790Z',
    '2023-11-08T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Ibukun Oyebanji',
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Moyinoluwa Atunnise',
  transactions: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2020-11-01T13:15:33.035Z',
    '2020-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2023-06-25T18:49:59.371Z',
    '2023-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Adeola Adeoye',
  transactions: [430, 1000, 700, 50, 90, 20000, 1400, 1200],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2020-11-01T13:15:33.035Z',
    '2020-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2023-06-25T18:49:59.371Z',
    '2023-07-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
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

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
let globalTimer;
const calcDaysPassed = (date1, date2) =>
  Math.round(Math.abs(date2 - date1) / (24 * 60 * 60 * 1000));

function formatDateMovement(date) {
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) {
    return 'Today';
  } else if (daysPassed === 1) {
    return 'Yesterday';
  } else if (daysPassed <= 7) {
    return `${daysPassed} days ago`;
  } else {
    const newDateObject = new Date();
    const newIntl = new Intl.DateTimeFormat(navigator.language, {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    }).format(newDateObject);
    return newIntl;
  }
}

function startLogoutTimer() {
  // Set Time to 5 minutes
  let time = 300;
  function tick() {
    let minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    let seconds = String(time % 60).padStart(2, 0);

    // when seconds is 0, logout

    labelTimer.textContent = `${minutes}:${seconds}`;
    if (time === 0) {
      clearInterval(timer);
      logOut();
    } else {
      time--;
    }
  }
  // Call the timer every second

  // On each callback, print the remaining time to the UI
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}

function currentUserTransactions(account, sort = false) {
  containerMovements.innerHTML = '';
  const sorted = sort
    ? account.transactions.slice().sort(function (a, b) {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
      })
    : account.transactions;
  sorted.forEach(function (transaction, transactionIndex) {
    const transactionType = transaction > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(account.movementsDates[transactionIndex]);
    const displayDate = `${formatDateMovement(date)}`;

    const allTransactions = ` <div class="movements__row">
            <div class="movements__type movements__type--${transactionType}">${
      transactionIndex + 1
    } ${transactionType}</div>
            <div class="movements__date">${displayDate}</div>
            <div class="movements__value">₦${formatMoney(
              Math.abs(transaction.toFixed(2))
            )}</div>
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

function checkTimeOfTheDay() {
  const currentTime = Date.now();
  const dateObject = new Date(currentTime);
  const hour = dateObject.getHours();
  if (hour >= 12 && hour <= 16) {
    return 'Good Afternoon';
  } else if (hour >= 17 && hour <= 20) {
    return 'Good Evening';
  } else if (hour >= 21) {
    return 'Good Night';
  } else if (hour >= 0 && hour <= 3) {
    return 'You Should Be In Bed.';
  } else if (hour >= 4 && hour <= 11) {
    return 'Good Morning';
  }
}

function calculateAllBalances(accs) {
  accs.forEach(function (acc) {
    const totalBalance = acc.transactions.reduce(function (
      accumulator,
      currentValue
    ) {
      return accumulator + currentValue;
    },
    0);
    acc.totalBalance = totalBalance.toFixed(2);
    const totalDepositsArray = acc.transactions.filter(function (value) {
      return value > 0;
    });
    const totalWithdrawalsArray = acc.transactions.filter(function (value) {
      return value < 0;
    });
    acc.depositsArray = totalDepositsArray;
    acc.withdrawalArray = totalWithdrawalsArray;
    acc.totalDeposits = totalDepositsArray
      .reduce(function (accumulator, currentValue) {
        return accumulator + currentValue;
      }, 0)
      .toFixed(2);
    acc.totalWithdrawals = totalWithdrawalsArray
      .reduce(function (accumulator, currentIndex) {
        return accumulator + Math.abs(currentIndex);
      }, 0)
      .toFixed(2);
    acc.totalInterest = totalDepositsArray
      .map(function (value) {
        return (value * acc.interestRate) / 100;
      })
      .filter(function (value) {
        return value >= 1;
      })
      .reduce(function (accumulator, currentIndex) {
        return accumulator + currentIndex;
      }, 0)
      .toFixed(2);
  });
}

calculateAllBalances(accounts);

function formatMoney(money) {
  const intlApi = new Intl.NumberFormat(navigator.language).format(money);
  return `${intlApi}`;
}

function getFirstName(user) {
  const userStr = user.owner.split(' ');
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

function resetGlobalTimeOut() {
  // Checks If globalTimer is defined, if it is, it cleared
  if (globalTimer) {
    clearInterval(globalTimer);
  }
  // If globalTimer is defined or not defined, a new ID value would be assigned to globalTimer which is a result of calling startLogoutTimer
  globalTimer = startLogoutTimer();
}
function showDate() {
  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    year: 'numeric',
    month: 'short',
    weekday: 'short',
  };
  const intlApi = new Intl.DateTimeFormat(navigator.language, options).format(
    now
  );
  labelDate.textContent = intlApi;
}

function updateUi(currentUser) {
  const currentHour = new Date().getHours();
  containerApp.style.opacity = 1;
  labelBalance.textContent = `₦${formatMoney(currentUser.totalBalance)}`;
  labelSumIn.textContent = `₦${formatMoney(currentUser.totalDeposits)}`;
  labelSumOut.textContent = `₦${formatMoney(currentUser.totalWithdrawals)}`;
  labelSumInterest.textContent = `₦${formatMoney(currentUser.totalInterest)}`;

  labelWelcome.textContent =
    currentHour >= 4
      ? `${checkTimeOfTheDay()} ${getFirstName(currentUser)}`
      : `You Should Be I Bed`;
  // labelWelcome.textContent = 'Logged In';
  showDate();
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
    currentUserTransactions(currentUser);
    clearInputFields();
    resetGlobalTimeOut();

    updateUi(currentUser);
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

function pushDate() {
  currentUser.movementsDates.push(new Date(Date.now()));
}

function updateDateOnTransfer() {
  pushDate();
  userToTransferTo.movementsDates.push(new Date(Date.now()));
}
// Request Loan.
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const userLoanInput = Math.floor(inputLoanAmount.value);
  clearInputFields();

  const loanValidity = currentUser.transactions.some(function (value) {
    return value >= userLoanInput * 0.1;
  });
  if (loanValidity) {
    setTimeout(function () {
      currentUser.transactions.push(userLoanInput);
      pushDate();
      calculateAllBalances(accounts);
      updateUi(currentUser);
      currentUserTransactions(currentUser);
      resetGlobalTimeOut();
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
    pushDate();
    userToTransferTo.movementsDates.push(new Date(Date.now()));
    calculateAllBalances(accounts);
    currentUserTransactions(currentUser);
    updateUi(currentUser);
    clearInputFields();
    resetGlobalTimeOut();
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
  resetGlobalTimeOut();
  currentUserTransactions(currentUser, !isSorted);
  isSorted = !isSorted;
  updateUi(currentUser);
});
