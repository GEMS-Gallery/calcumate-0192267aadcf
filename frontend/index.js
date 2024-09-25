import { backend } from 'declarations/backend';

let display = document.getElementById('display');
let currentInput = '';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

function updateDisplay() {
    display.value = currentInput;
}

function inputDigit(digit) {
    if (waitingForSecondOperand) {
        currentInput = digit;
        waitingForSecondOperand = false;
    } else {
        currentInput = currentInput === '0' ? digit : currentInput + digit;
    }
    updateDisplay();
}

function inputDecimal() {
    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay();
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        performCalculation();
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
}

async function performCalculation() {
    const secondOperand = parseFloat(currentInput);
    let result;

    switch (operator) {
        case '+':
            result = await backend.add(firstOperand, secondOperand);
            break;
        case '-':
            result = await backend.subtract(firstOperand, secondOperand);
            break;
        case '*':
            result = await backend.multiply(firstOperand, secondOperand);
            break;
        case '/':
            if (secondOperand === 0) {
                currentInput = 'Error';
                updateDisplay();
                return;
            }
            const divisionResult = await backend.divide(firstOperand, secondOperand);
            result = divisionResult[0];
            break;
    }

    currentInput = String(result);
    firstOperand = result;
    updateDisplay();
}

function resetCalculator() {
    currentInput = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

document.querySelector('.keypad').addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) return;

    if (target.classList.contains('number')) {
        inputDigit(target.textContent);
    } else if (target.classList.contains('decimal')) {
        inputDecimal();
    } else if (target.classList.contains('operator')) {
        handleOperator(target.textContent);
    } else if (target.classList.contains('equals')) {
        if (operator && firstOperand !== null) {
            performCalculation();
        }
    } else if (target.classList.contains('clear')) {
        resetCalculator();
    }
});

updateDisplay();
