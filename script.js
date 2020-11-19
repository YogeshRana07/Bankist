'use strict';
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const movement = [200, 450, -400, 3000, -650, -130, 70, 1300];
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
containerMovements.textContent= '';
///////////////Display All Movements///////////////
const displayMovements = function(movements, sort=false)
{
	const movs = sort?movements.slice().sort((a,b)=>{a-b;}):movements;
	movs.forEach((mov,i) => {
		
		const type = mov > 0 ? 'deposit': 'withdrawal';
	    const html = `
	      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${type}</div>
          <div class="movements__date">${type}</div>
          <div class="movements__value">${mov}€</div>
          </div>`
          containerMovements.insertAdjacentHTML('afterbegin',html);
	});
};

////////////////////////////Print Total Balance////////////////////////////////////
const calcPrintBalance = function(acc)
{
 acc.balance = acc.movements.reduce((acc,curr) => {
	return acc+curr;
},0);
labelBalance.textContent = `${acc.balance} 💲`;
};

////////////////////Create User Name///////////////////
const createUsername = function(accs)
{
	accs.forEach((acc) => {
	 acc.username = acc.owner.toLowerCase()
     .split(' ')
     .map(item => item[0])
     .join('');
	});
};
createUsername(accounts);

/////////////////////Calculate Summary/////////////////

const calcDisplaySummary = function(acc) {
	const income = acc.movements
	.filter(mov=>mov>0)
	.reduce((acc,mov)=>acc+mov,0);
	labelSumIn.textContent = `${income}💲`;

	const out = acc.movements
	.filter(mov=>mov<0)
	.reduce((acc,mov)=>acc+mov,0);
	labelSumOut.textContent = `${Math.abs(out)}💲`;

	const interest = acc.movements.filter(mov=> mov>0)
	.map(deposit => deposit*acc.interest/100)
	.filter(interest => interest >=1)
	.reduce((acc,mov) =>acc+mov,0);
	labelSumInterest.textContent = `${interest}💲`;
};

////////////////Update User Interface///////////////
const updateUI = function(acc){
	displayMovements(acc.movements);
    calcDisplaySummary(acc);
    calcPrintBalance(acc);
    // Clear input fields
    inputTransferTo.value = inputTransferAmount.value = inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
};

//////////////////////LOGIN IN APP///////////////////////
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Update UI
    updateUI(currentAccount);
  }
});

///////////////Transfer money////////////////
btnTransfer.addEventListener('click',(e) => {
	e.preventDefault();
	const amount = Number(inputTransferAmount.value);
	const recieverAcc = accounts.find(acc => 
		acc.username === inputTransferTo.value
		);
	if(amount > 0 && currentAccount.balance >= amount && recieverAcc?.username !== currentAccount.username)
	{
		currentAccount.movements.push(-amount);
		recieverAcc.movements.push(amount);
		updateUI(currentAccount);
	}

});


////////////Close Account////////////
btnClose.addEventListener('click',(e) => {
  e.preventDefault
   if(currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value))
  {
  	const index = accounts.findIndex(acc => acc.username === currentAccount.username);
  	accounts.splice(index,1);
  	console.log(accounts);
  }
  else
  {
  	alert('Please Enter Correct Credentional!!');
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

/////////////Request A Loan///////////////
btnLoan.addEventListener('click',(e) => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if(amount > 0 && accounts.some(acc => acc.deposit >= 0.1*amount))
  {
  	//Add the movement in the currentAccount
  	currentAccount.movements.push(amount);
  	//Update UI
  	updateUI(currentAccount);
  }
  else
  {
  	alert('Sorry Loan Not Granted!!');
  }
  inputLoanAmount.value = '';
});

//Sorting Button
let sorted = false;
btnSort.addEventListener('click',(e) => {
	e.preventDefault();
	displayMovements(currentAccount.movements, !sorted);
	sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
