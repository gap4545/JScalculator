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
let isNumLast = false;

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
    //Stolen from a DelftStack article... But I changed it to fit my needs
    if (+(Math.round(num + "e+3")  + "e-3") !== Number()) {
        return num;
    } else {
        return +(Math.round(num + "e+3")  + "e-3");
    };
}

function operate(equation) {
    //Breaks operationDisplay's text into two numbers and the operator, sets vars to initial vals, performs operation, appends result to resultDisplay
    let equationArr = equation.split(' ');
    let num1 = Number(equationArr[0]);
    let operator = equationArr[1];
    let num2 = Number(equationArr[2]);
    let result;

    hasResult = true;
    isOperatorIn = false;
    isNewEquation = true;
    isDecimalIn = false;
    isNumLast = false;

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

function measureTextWidth(text, font) {
    //Measures text width. Not originally mine but seems to be a common way to measure text width 
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    context.font = font;

    const metrics = context.measureText(text);
    return metrics.width;
};

function scaleText(displayElement) {
    //Scales text down to fit inside display when text overflows display and scales text up upon new equation if text width is smaller then display width
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

function checkOperation() {
    //This is a cheat to check for an operator in operationDisplay
    if (operationDisplay.textContent.includes(' ')) {
        isOperatorIn = true;
    } else {
        isOperatorIn = false;
    };
    //Checks for a valid operation
    isNumLast = isFinite(operationDisplay.textContent[operationDisplay.textContent.length - 1]) && operationDisplay.textContent[operationDisplay.textContent.length - 1] !== ' ';
    if (isOperatorIn == true && isNumLast == true) {
        canOperate = true;
    } else {
        canOperate = false;
    };
};

function appendDisplay(toAppend) {
    //Checks to see how operationDisplay's text should change
    if (isNewEquation == true && isFinite(toAppend)) {
        operationDisplay.textContent = toAppend;
    } else if (isSecondOperator == true || hasResult == true && !(isFinite(toAppend))) {
        operationDisplay.textContent = resultDisplay.textContent + toAppend;
    } else {
        operationDisplay.textContent += toAppend;
    };
    scaleText(operationDisplay);
    hasResult = false;
    isNewEquation = false;
    checkOperation();
};

function isOperator(key) {
    const operations = {'+' : undefined, '-' : undefined, '*' : undefined, '/' : undefined, '×' : undefined, '÷' : undefined};

    if (key in operations) {
        if (key == '*') {
            key = '×';
        } else if (key == '/') {
            key = '÷';
        };
        if (isOperatorIn == false) {
            appendDisplay(` ${key} `);
        } else if (canOperate == true) {
            isSecondOperator = true;
            operate(operationDisplay.textContent);
            appendDisplay(` ${key} `);
            isSecondOperator = false;
        };
    };
};

function deleteLast() {
    let operationDisplayString = operationDisplay.textContent
    let lastChar = operationDisplayString[operationDisplayString.length - 1];
    if (lastChar == '.') {
        operationDisplay.textContent = operationDisplayString.substring(0, operationDisplayString.length - 1);
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

window.addEventListener('keyup', keyed => {
    let keyPressed = keyed.key
    if (isFinite(keyPressed)) {
        appendDisplay(keyPressed);
    } else if (keyPressed == '=' && canOperate == true || keyPressed == 'Enter' && canOperate == true) {
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
    if (canOperate == true){
        operate(operationDisplay.textContent);
    };
});

decimalButton.addEventListener('click', function() {
    if (isDecimalIn == false && isNumLast == true) {
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
