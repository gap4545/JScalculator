const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const deleteButton = document.querySelector('.delete');
const clearButton = document.querySelector('.clear');
const decimalButton = document.querySelector('.decimal');
const equalsButton = document.querySelector('.equals');
const display = document.querySelector('.display');
const operationDisplay = document.querySelector('.operation');
const resultDisplay = document.querySelector('.result');

let isOperatorIn = false;
let isSecondOperator = false;
let isNewEquation = true;
let isDecimalIn = false;
let hasResult = false;
let isNumberLast = false;

function add(num1, num2) {
    return num1 + num2;
};

function subtract(num1, num2) {
    return num1 - num2;
};

function multiply(num1, num2) {
    return num1 * num2;
};

function divide(num1, num2) {
    return num1 / num2;
};

function round(num) {
    if (+(Math.round(num + "e+3")  + "e-3") !== Number()) {
        return num;
    } else {
        return +(Math.round(num + "e+3")  + "e-3");
    };
}

function operate(equation) {
    let equationArr = equation.split(' ');
    let num1 = Number(equationArr[0]);
    let operator = equationArr[1];
    let num2 = Number(equationArr[2]);
    let result;

    hasResult = true;
    isOperatorIn = false;
    isNewEquation = true;
    isDecimalIn = false;
    isNumberLast = false;

    switch(operator) {
        case '+': 
            result = add(num1, num2);
            break;
        case '-':
            result = subtract(num1, num2);
            break;
        case '×':
            result = multiply(num1, num2);
            break;
        case '÷':
            result = divide(num1, num2);
            break;
    };
    resultDisplay.textContent = round(result);
    scaleText(resultDisplay);
};

function isOperator(key) {
    const operations = {'+' : undefined, '-' : undefined, '*' : undefined, '/' : undefined, '×' : undefined, '÷' : undefined};

    if (key in operations) {
        if (key == '*') {
            key = '×';
        } else if (key == '/') {
            key = '÷';
        };
        if (isOperatorIn == false && hasResult == false) {
            console.log('first op')
            isDecimalIn = false;
            isOperatorIn = true;
            appendDisplay(` ${key} `);
        } else if (isOperatorIn == false && hasResult == true) {
            console.log('second op')
            isDecimalIn = false;
            isOperatorIn = true;
            appendDisplay(` ${key} `);
        } else if (isNumberLast == true && isOperatorIn == true) {
            console.log('third op')
            isSecondOperator = true;
            operate(operationDisplay.textContent);
            isOperatorIn = true;
            isNumberLast = false;
            appendDisplay(` ${key} `);
            isSecondOperator = false;
        };
    };
};

function measureTextWidth(text, font) {

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    context.font = font;

    const metrics = context.measureText(text);
    return metrics.width;
};

function scaleText(displayElement) {
    let eleStyle = window.getComputedStyle(displayElement);
    let fontSize = parseInt(eleStyle.fontSize);
    let textWidth = measureTextWidth(displayElement.textContent, eleStyle.font, fontSize);

    while (textWidth > parseInt(eleStyle.width)) {
        fontSize -= 0.2;
        displayElement.style.fontSize = `${fontSize}px`;
        textWidth = measureTextWidth(displayElement.textContent, eleStyle.font, fontSize);
    };
    while (fontSize < document.documentElement.clientHeight * 2.5 / 100 && isNewEquation == true) {
        fontSize += 0.2;
        displayElement.style.fontSize = `${fontSize}px`;
        textWidth = measureTextWidth(displayElement.textContent, eleStyle.font, fontSize);
    };
};

function appendDisplay(toAppend) {
    console.log(['check 1', {'isOperatorIn' : isOperatorIn, 'hasResult' : hasResult, 'isNewEquation' : isNewEquation, 'isSecondOperator' : isSecondOperator, 'isNumberLast' : isNumberLast}]);
    if (isOperatorIn == true && hasResult == true && isNewEquation == true || isSecondOperator == true && hasResult == false) {
        operationDisplay.textContent = resultDisplay.textContent + toAppend;
    } else if (isNewEquation == true && isSecondOperator == false) {
        operationDisplay.textContent = toAppend;
    } else {
        operationDisplay.textContent = operationDisplay.textContent + toAppend;
    };
    checkOperation();
    console.log(['check 2', {'isOperatorIn' : isOperatorIn, 'hasResult' : hasResult, 'isNewEquation' : isNewEquation, 'isSecondOperator' : isSecondOperator, 'isNumberLast' : isNumberLast}]);
    scaleText(operationDisplay);
    hasResult = false;
    isNewEquation = false;
};

function deleteLast() {
    let operationDisplayString = operationDisplay.textContent
    let lastChar = operationDisplayString[operationDisplayString.length - 1];
    if (lastChar == '.') {
        isDecimalIn = false;
    } else if (lastChar == ' ') {
        operationDisplay.textContent = operationDisplayString.substring(0, operationDisplayString.length - 3);
    } else {
        operationDisplay.textContent = operationDisplayString.substring(0, operationDisplayString.length - 1);
    };
    hasResult = false;
    isNewEquation = false;
    checkOperation();
};

function checkOperation() {
    const operations = {'+' : undefined, '-' : undefined, '*' : undefined, '/' : undefined, '×' : undefined, '÷' : undefined};
    let splitOperation = operationDisplay.textContent.replace(/ /g, '').split('');
    console.log(splitOperation);
    if (isOperatorIn == false) {
        if (splitOperation.slice(1).some(char => char in operations)) {
            isOperatorIn = true;
        };
    } else if (isOperatorIn == true) {
        if (!(splitOperation.slice(1).some(char => char in operations))) {
            isOperatorIn = false;
        };
    };
    if (isFinite(splitOperation[splitOperation.length-1]) && splitOperation[splitOperation.length-1] !== '') {
        isNumberLast = true;
    } else {
        isNumberLast = false;
    };
};

window.addEventListener('keyup', keyed => {
    let keyPressed = keyed.key
    if (isFinite(keyPressed)) {
        appendDisplay(keyPressed);
    } else if (keyPressed == '=' && isNumberLast == true || keyPressed == 'Enter' && isNumberLast == true) {
        operate(operationDisplay.textContent);
    } else if (keyPressed == '.' && isDecimalIn == false) {
        appendDisplay(keyPressed);
        isDecimalIn = true;
    } else if (keyPressed == 'Backspace') {
        deleteLast();
    } else {
        isOperator(keyPressed);
    };
});

numberButtons.forEach(button => {
    button.addEventListener('click', function() {
        appendDisplay(button.textContent);
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', function() {
        isOperator(button.textContent);
    });
});

equalsButton.addEventListener('click', function() {
    if (isNumberLast == true && isOperatorIn == true){
        operate(operationDisplay.textContent);
    };
});

decimalButton.addEventListener('click', function() {
    if (isNumberLast == true && isDecimalIn == false) {
        isDecimalIn = true;
        appendDisplay('.');
    } else if (isDecimalIn == false) {
        isDecimalIn = true;
        appendDisplay('0.')
    };
});

deleteButton.addEventListener('click', function() {
    deleteLast();
})

clearButton.addEventListener('click', function() {
    operationDisplay.textContent = '';
    resultDisplay.textContent = '';
    isOperatorIn = false;
    isSecondOperator = false;
    isNewEquation = true;
    isDecimalIn = false;
    hasResult = false;
});
