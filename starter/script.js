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
//
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//Creates transaction history
const displayMovements = function (movements) {
  containerMovements.innerHTML = ''; //removes placeholder HTML

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
     <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div> 
      <div class="movements__value">${mov}</div>
    </div>  `;
    containerMovements.insertAdjacentHTML('afterbegin', html); //afterbegin allows newest child el to be on top
  });
};
displayMovements(account1.movements);

//current balance
const calcDisplayBalance = function (transaction) {
  const balance = movements.reduce((acc, transaction) => acc + transaction, 0);
  labelBalance.textContent = `${balance} EUR`;
};

calcDisplayBalance(account1.movements);

//creating username
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

/////////////////////////////////////////////////

// const arr = [23, 11, 64];
// console.log(arr.at(0));
//
//gettin last arr element
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));
//

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
// if (movement > 0) {
// console.log(`You deposited ${movement}`);
// } else {
// console.log(`You withdrew ${Math.abs(movement)}`);
// }
// }
//
// console.log('-----FOREACH-----');
//
// movements.forEach(function (movement, index) {
// if (movement > 0) {
// console.log(`Movement ${index + 1} You deposited ${movement}`);
// } else {
// console.log(`Movement ${index + 1} You withdrew ${Math.abs(movement)}`);
// }
// });

//MAP
// const currencies = new Map([
// ['USD', 'United States dollar'],
// ['EUR', 'Euro'],
// ['GBP', 'Pound sterling'],
// ]);
//
// currencies.forEach(function (value, key, map) {
// console.log(`${key}: ${value}`);
// });
//
//SET
//
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
//
// currenciesUnique.forEach(function (value, _, map) {
// console.log(`${value}: ${value}`);
// });
//

// const deposits = movements.filter(function (mov) {
// return mov > 0;
// });
// console.log(deposits);
//
// const depositss = [];
// for (const mov of movements) if (mov > 0) depositss.push(mov);
// console.log(depositss);
//
// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

//console.log(movements);
//accumulator is like a snowball
// const balance = movements.reduce(function (accumulator, current, i, arr) {
// console.log(`Iteration ${i} : ${accumulator}`);
// return accumulator + current;
// }, 0); // 0 is the initial value
//

// const balance = movements.reduce((acc, cur) => acc + cur, 0);
//
// console.log(balance);
//
// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);
//
