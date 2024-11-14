'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
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

const accounts = [account1, account2];

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
//
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const currentDate = function () {
  labelDate.textContent = new Date().toLocaleDateString();
};
currentDate();

//Creates transaction history
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ''; //removes placeholder HTML

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  //if sort is true then ...

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = `${date.getFullYear()}`;
    const displayDate = `${month}/${day}/${year}`;

    const html = `
     <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div> 
       <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>  `;
    containerMovements.insertAdjacentHTML('afterbegin', html); //afterbegin allows newest child el to be on top
  });
};

//current balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

//Display summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const expenses = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(expenses.toFixed(2))}€`;

  const interestRate = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100, 0)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interestRate.toFixed(2)}€`;
};

//creating username and adds to accounts array
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

//function updates summary, balance & movements
const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);
  //Display balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

//Event handler
let currentAccount;

//FAKE ALWAYS LOGGED IN
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  //prevents form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  //? = optional chaining
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome back , ${
      currentAccount.owner.split(' ')[0]
    }!`;
    containerApp.style.opacity = 100;

    //clear input feilds after login
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    //updates UI
    updateUI(currentAccount);
  }
});

//transfer btn
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc && //if this acc exists
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username //ensures recipient are not sending $$ to themsleves
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  //loan can be given if a single deposit is more than 10% of the loan request.
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add movement
    currentAccount.movements.push(amount);
    //update UI
    updateUI(currentAccount);
    //clear input feild
    inputLoanAmount.value = '';
  }
});

// close btn
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    (inputCloseUsername.value =
      currentAccount.username &&
      Number(inputClosePin.value) === currentAccount.pin)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //delets account
    accounts.splice(index, 1);

    //hides UI
    containerApp.style.opacity = 0;

    //clears input form
    inputCloseUsername.value = inputClosePin.value = '';
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted; //allows the toggle
});

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
// accumulator is like a snowball
//const balance = movements.reduce(function (accumulator, current, i, arr) {
// console.log(`Iteration ${i} : ${accumulator}`);
//  return accumulator + current;
//}, 0); // 0 is the initial value
//

// const balance = movements.reduce((acc, cur) => acc + cur, 0);
//
// console.log(balance);
//
// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);
//

//maximum value
// const max = movements.reduce((acc, mov) => {
// if (acc > mov) return acc;
// else return mov;
// }, movements[0]);
// console.log(max);
//

//challenge 2
// const DogAges1 = [5, 2, 4, 1, 15, 8, 3];
// const DogAges2 = [16, 6, 10, 5, 6, 1, 4];
//
// const calcHumanYears = function (dogAges) {
// const humanAges = dogAges
// .map(ages => (ages <= 2 ? ages * 2 : ages * 2 + 16))
// .filter(ages => ages > 18)
// .reduce((acc, age, _, arr) => acc + age / arr.length, 0);
// return humanAges;
// };
//
// console.log(calcHumanYears(DogAges1));
//
// const euroTOusd = 1.1;
//
//Pipeline
// const totalInUSD = movements
// .filter(mov => mov > 0)
// .map(mov => mov * euroTOusd)
// .reduce((acc, mov) => acc + mov, 0);
//
// console.log(totalInUSD);

// const firstWithdrawl = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawl);
//
// console.log(accounts);
//
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

//some and every
// console.log(movements);
// console.log(movements.includes(-130)); //checks for equality, checks for only -130

//some() will test for condition, any num above 0 return true
// const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);

//Every , returns true only if all elements meet condition
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

//Flat, Flatmap
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat()); //makes it all one array
//
// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));
//
//flat
// const overallBalance = accounts
// .map(acc => acc.movements)
// .flat()
// .reduce((acc, mov) => acc + mov, 0);
//
// console.log(overallBalance);
//
//flatMap
// const overallBalance2 = accounts
// .flatMap(acc => acc.movements)
// .reduce((acc, mov) => acc + mov, 0);
//
// console.log(overallBalance2);
//

//sorting arrays with strings
// const owners = ['jonas', 'zach', 'adam', 'martha'];
// console.log(owners.sort());

//Numbers
// console.log(movements);

//return < 0 = A,B (keep order)
//return > 0 = B,A (switch order)
//ascending
// movements.sort((a, b) => {
// if (a > b) return 1;
// if (a < b) return -1;
// });
// console.log(movements);

//ascending as well
// movements.sort((a, b) => a - b);
// console.log(movements);
//
//decending
// movements.sort((a, b) => {
// if (a > b) return -1;
// if (a < b) return 1;
// });
// console.log(movements);
//

//Empty arrays + fill method
// const arr = [1, 2, 3, 4, 5, 6, 7];
// const x = new Array(7);
// console.log(x);
//
//x.fill(1);
// x.fill(1, 3, 5);
// console.log(x);
//
// arr.fill(23, 4, 6);
// console.log(arr);
//
//array.from
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);
//
// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// labelBalance.addEventListener('click', function () {
// const movementsUI = Array.from(
// returns class into an array
// document.querySelectorAll('.movements__value'),
// el => Number(el.textContent.replace('€', '')) //mapping func turns array to a number
// );
// console.log(movementsUI);
// });

//1.
// const bankDepositSum = accounts
// .flatMap(acc => acc.movements) //sets elements into array
// .filter(mov => mov > 0) //filters for el > 0
// .reduce((sum, cur) => sum + cur, 0); //adds all el
// console.log(bankDepositSum);
//
// 2. using filter
// const numDepositsOver1000 = accounts
// .flatMap(acc => acc.movements) //sets elements into array
// .filter(num => num >= 1000).length; // filters el for more than 1000 and finds length
// console.log(numDepositsOver1000);
//
// using reduce
// const numDepositsOver1000_2 = accounts
// .flatMap(acc => acc.movements) //sets el in array
// .reduce((count, curr) => (curr >= 1000 ? count + 1 : count), 0);
// .reduce((count, curr) => (curr >= 1000 ? ++count : count), 0);
// console.log(numDepositsOver1000_2);
//
// 3.
// const sums = accounts
// .flatMap(acc => acc.movements)
// .reduce(
// (sums, curr) => {
// curr > 0 ? (sums.deposit += curr) : (sums.withdrawls += curr);
// sums[curr > 0 ? 'deposits' : 'withdrawls'] += curr;
// return sums;
// },
// { deposit: 0, withdrawls: 0 }
// );
// console.log(sums);
//
// 4.str --> titleCase
// this is a nice title --> This Is a Nice Title
// const convertTitleCase = function (title) {
// const capitalize = str => str[0].toUpperCase() + str.slice(1);
//
// const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
//
// const titleCase = title
// .toLowerCase()
// .split(' ')
// .map(word => (exceptions.includes(word) ? word : capitalize(word)))
// .join(' ');
//
// return capitalize(titleCase);
// };

// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title, but not too long'));
// console.log(
// convertTitleCase('and here is another title, with another EXAMPLE')
// );

// challenge 4
// const dogs = [
// { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
// { weight: 8, curFood: 200, owners: ['Matilda'] },
// { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
// { weight: 32, curFood: 340, owners: ['Michael'] },
// ];
//
// 1.
// dogs.forEach(dog => (dog.recommendFood = Math.trunc(dog.weight ** 0.75 * 28)));
// console.log(dogs);
//
// 2.
// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(dogSarah);
// console.log(
// `Sarah's dog is eating too ${
// dogSarah.curFood > dogSarah.recommendFood ? 'much' : 'little'
// }`
// );
//
// 3.
// const ownersFeedTooMuch = dogs
// .filter(dog => dog.curFood > dog.recommendFood)
// .map(dog => dog.owners)
// .flat();
// console.log(ownersFeedTooMuch);
//
// const ownersFeedTooLittle = dogs //filters for condition, maps for owners matching condition, makes new array from sub array elements
// .filter(dog => dog.curFood < dog.recommendFood)
// .map(dog => dog.owners)
// .flat();
// console.log(ownersFeedTooLittle);
//
// 4.
// dogs.forEach(dog =>
// dog.curFood > dog.recommendFood
// ? console.log(`${dog.owners} is feeding thier dog too much food`)
// : console.log(`${dog.owners} is feeding thier dog too little food`)
// );

// console.log(`${ownersFeedTooMuch.join(' and ')}'s dog eats to much!`);
// console.log(`${ownersFeedTooLittle.join(' and ')}'s dog eats to little!`);
//
// 5.
// dogs.forEach(dog =>
// dog.curFood === dog.recommendFood
// ? console.log(`${dog.owners} is feeding their dog the exact amount needed`)
// : console.log(`No owners are feeding their dogs the exact amount`)
// );
// console.log(dogs.some(dog => dog.curFood === dog.recommendFood)); //asking for true or false
//
// 6.
// const checkEatingOkay = dog =>
// dog.curFood > dog.recommendFood * 0.9 &&
// dog.curFood < dog.recommendFood * 1.1;
//
// console.log(dogs.some(checkEatingOkay)); //returns true or false
//
// 7.
// console.log(dogs.filter(checkEatingOkay));
// const ownerFeedingOkay = dogs
// .filter(
// dog =>
// dog.curFood > dog.recommendFood * 0.9 &&
// dog.curFood < dog.recommendFood * 1.1
// )
// .map(dog => dog.owners)
// .flat();
// console.log(ownerFeedingOkay);
//
//8.
// const dogsSorted = dogs
// .slice()
// .sort((a, b) => a.recommendFood - b.recommendFood);
// console.log(dogsSorted);

//Numbers-Dates-Timers

// console.log(23 === 23.0);

//Base 10 is 0 --> 9
//Binary Base 2 is 0 --> 1
// console.log(0.1 + 0.2);

//conversion
// console.log(Number('23'));
// console.log(+'23');
//
// parsing
// console.log(Number.parseInt('30px'));
// console.log(Number.parseInt('e23', 10));
//
// console.log(Number.parseInt('  2.5rem  '));
// console.log(Number.parseFloat('  2.5rem  '));
//
// console.log(parseFloat('  2.5rem  '));
//
// Check if value is NaN
// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN(+'20X'));
// console.log(Number.isNaN(23 / 0));
//
// Checking if value is number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20X'));
// console.log(Number.isFinite(23 / 0));
//
// console.log(Number.isInteger(23));
// console.log(Number.isInteger(23.0));
// console.log(Number.isInteger(23 / 0));

//square root
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));
//max
// console.log(Math.max(5, 18, 22, 11, 50));
// console.log(Math.max(5, '18', 22, 11, 50));
// console.log(Math.max(5, 18, '22px', 11, 50));

// min
// console.log(Math.min(5, 18, 22, 11, 50));
//
// console.log(Math.PI * Number.parseFloat('10px') ** 2);
//
// console.log(Math.trunc(Math.random() * 6) + 1);
//
// const randomInt = (min, max) =>
// Math.floor(Math.random() * (max - min) + 1) + min;
// 0.. 1 --> 0...(max-min) -> min...(max - min + min)
// console.log(randomInt(2, 8));

//Rounding integers
// console.log(Math.trunc(23.2));
// console.log(Math.round(23.8));

// console.log(Math.ceil(23.3)); //always rounds us

// console.log(Math.floor('23.8')); //always rounds down

// console.log(Math.trunc(-23.8));
// console.log(Math.floor(-23.8)); //rounding the opposite direction when negative

//Floating points / rounding decimals
// console.log((2.7).toFixed(0)); //returns string and rounds
// console.log((2.7).toFixed(3));
// console.log((2.345).toFixed(2));
// console.log(+(2.7).toFixed(0)); // + converts string to a number

//Remainder Operator
// console.log(5 % 2);
// console.log(5 / 2); //5 = 2 * 2 + 1
//
// console.log(8 % 3);
// console.log(8 / 3); // 8 = 3 * 2 + 2

// const isEven = n => n % 2 === 0; //false would be === 1;
// console.log(isEven(8));
// console.log(isEven(23));
// console.log(isEven(104));

// labelBalance.addEventListener('click', function () {
// [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
// if (i % 2 === 0) row.style.backgroundColor = 'orangered';
// if (i % 2 === 1) row.style.backgroundColor = 'lightgreen';
// });
// });
//

//BigInt
// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(2 ** 53 + 1);
//
// console.log(128934918792384798389283n);
// console.log(BigInt(128934918792384798389283));
//
//operations
// console.log(10000n + 10000n);

//Dates
//create a date
// const now = new Date();
// console.log(now);
//
// console.log(new Date(account1.movementsDates[0]));
// console.log(new Date(2037, 10, 19, 15, 23, 5));
//
//working with dates
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.toISOString());
// console.log(future.getTime());
// console.log(Date.now());
