const operators = [`^`,`*`,`/`,`+`,`-`];
const MAX_VALUE = 1e+300;
const MIN_VALUE = -1e-300;
const PI = Math.PI;

createInterface();

function checkInput(e) {
    symbolArray = getInput().split(``);
    if (this.textContent) symbolArray.push(this.textContent);
    let lastCoupleSymbols = getLastСoupleSymbols(symbolArray);
    
    if (lastCoupleSymbols[0] === `.` && !checkDot(symbolArray)) symbolArray.pop();
    else if (!checkLastSymbol(lastCoupleSymbols[0], lastCoupleSymbols[1])) symbolArray.pop();

    setInput(symbolArray.join(``));
}

function getLastСoupleSymbols(symbolArray) {
    let currentSymbol = ``;
    let previousSymbol = ``;

    if (symbolArray.length > 0) currentSymbol = symbolArray[symbolArray.length - 1];
    if (symbolArray.length > 1) previousSymbol = symbolArray[symbolArray.length - 2];

    return [currentSymbol, previousSymbol];
}

function getInput() {
    let textField = document.querySelector(`.textField`);
    let text = textField.value;

    return text;
}

function setInput(text) {
    let textField = document.querySelector(`.textField`);
    if (text !== undefined) textField.value = text;
    textField.focus();
}

function setMessage(text) {
    let messageField = document.querySelector(`.message`);
    messageField.textContent = text;
}

function setError() {
    let messageField = document.querySelector(`.message`);
    messageField.classList.add(`error`);
}
function resetError(){
    let messageField = document.querySelector(`.message`);
    messageField.classList.remove(`error`);
}

function checkLastSymbol(currentSymbol, previousSymbol) {
    let regForFirstSymbol = /[\-\(\d\π]/;
    let regForSymbol = /(^(\d*|\π)$)|(^(\d*|\π)[.\)\+\-\*\/\^e]?$)|(^[.\(\+\-\*\/\^]?(\d*|\π)$)|(^\)?[\)\(\+\-\*\/\^]?$)|(^[\)\(\+\-\*\/\^]?\(?$)|(^e[\-\+]$)|(^\(\-$)|(^[\-\+]\-$)/;

    if (previousSymbol) return regForSymbol.test(previousSymbol+currentSymbol);
    else return regForFirstSymbol.test(currentSymbol);
}

function checkDot(array) {
    let regForDot = /^\-?([\(\)]*[\-\+]?(\d+|\d+\.\d+|\d+\.?\d*e[\+\-]\d+|\π)[\+\-\*\/\^\)][\)\(]*[\-\*\+\^\/]?)*\d+$/;
    let newArr = array.concat();
    newArr.pop();
    let text = newArr.join(``);
    return regForDot.test(text);
}

function enter(e) {
    if(e.type !== `click` && e.code !== `Enter` && e.code !== `NumpadEnter`) return;
    let text = getInput();
    resetError();

    if (checkSpaces(text)) {
        setMessage(`Удалите пробелы`);
        setError();
        return;
    }
    else if (checkString(text)) {
        setMessage(`Неправильный ввод`);
        setError();
        return;
    }
    else if (!checkParentheses(text)) {
        setMessage(`Не все скобки закрыты`);
        setError();
        return;
    }
    else setMessage(text);
    let result = calculateFullExpression(text);
    setInput(result);
}

function checkString(text) {
    let reg = /([^\d\+\-\*\/\^\.\)\(e\π]+|[\*\/\^\.e]{2}|\π{2,})/;
    return reg.test(text);
}

function checkSpaces(text) {
    return /\s/.test(text);
}

function checkParentheses(text) {
    let array = text.split(``);
    let countOpen = 0;
    let countClose = 0;
    for (let symbol of array){
        if (symbol === `(`) countOpen++;
        else if (symbol === `)`) countClose++;
    }

    return countOpen === countClose;
}

function calculateFullExpression(input) {
    let regForParentheses = /\([^\(\)]*\)/;
    let singleExpressionResults = [];
    input = addPi(input);
    input = removeExcessOperators(input);

    while (regForParentheses.test(input) || /.[\+\-\*\/\^]+./.test(input)){
        let expression = input;
        if (regForParentheses.test(input)) {
            expression = input.match(regForParentheses)[0];
        }
        let newExpression = returnOperationsResults(expression, singleExpressionResults);
        input = input.replace(expression, newExpression);
        let result = calculate(newExpression);
        if (result === ``) return ``;

        singleExpressionResults.push(result);
        input = input.replace(newExpression, `r${singleExpressionResults.length-1}`);
        input = removeExcessOperators(input);
    }

    return returnOperationsResults(input, singleExpressionResults);
}

function addPi(text) {
    let regForPi = /\π/;
    while (regForPi.test(text)) {
        text = text.replace(regForPi, PI);
    }
    return text;
}

function removeExcessOperators(text) {
    let regNeg = /(\+\-)|(\-\+)/;
    let regPos = /(\-\-)|(\+\+)/;
    let regExc1 = /(^\+)|([\+\-\*\/\^]$)/;
    let regExc2 = /(\(\+)/
    while (regNeg.test(text) || regPos.test(text) || regExc1.test(text) || regExc2.test(text)) {   
        if (regNeg.test(text)) text = text.replace(regNeg, `-`);
        if (regPos.test(text)) text = text.replace(regPos, `+`);
        if (regExc1.test(text)) text = text.replace(regExc1, ``);
        if (regExc2.test(text)) text = text.replace(regExc2, `(`);
    }

    return text;
}

function findOperands(expression, operator) {
    let a = ``;
    let b = ``;
    let indexOfOperator = findOperatorIndex(expression, operator);

    for (let i = indexOfOperator - 1; i >= 0; i--) {
        if (operators.includes(expression[i]) || expression[i] === `(`) break;
        a += expression[i];
    }
    a=reverseString(a);
    for (let i = indexOfOperator + 1; i <= expression.length - 1; i++) {
        if (operators.includes(expression[i]) || expression[i] === `)`) break;
        b += expression[i];
    }
  
    return [a, b, expression[indexOfOperator]];
  }

function reverseString(str) {
    return str.split(``).reverse().join(``);
}

function findOperatorIndex(expression, operator) {
    let regMultDiv = /[\*\/]/;
    let regAddSub = /[\+\-]/;
    let indexOfOperator = 0;
    indexOfOperator = expression.indexOf(operator);
    if (regMultDiv.test(operator) || regMultDiv.test(expression)) indexOfOperator = expression.search(regMultDiv);
    else if (regAddSub.test(operator)) indexOfOperator = expression.search(regAddSub);
    
    return indexOfOperator;
}
  
function calculate(expression) {
    let a = ``;
    let b = ``;
    let result = 0;
    let param = [];
    let specialValues = [];
  
    for (let operator of operators) {
        while (expression.includes(operator)) {
            param = findSpecialValues(specialValues, expression);
            specialValues = param[0];
            expression = param[1];

            let operands = findOperands(expression, operator);
            a = operands[0];
            b = operands[1];
            operator = operands[2];

            operands = returnSpecialValues(a, b, specialValues);
            let aSV = operands[0];
            let bSV = operands[1];
            if (!a) {
                result = bSV;
                return result;
            }

            result = operate(operator, Number(aSV), Number(bSV));
            expression = expression.replace(a + operator + b, result.toString());
            
            if (!checkResult(result, operator)) {
                if (operator === `/` && Number(b) === 0) setMessage(`Деление на 0`);
                else setMessage(`Превышен лимит`);
                setError();
                return ``;
            }
        }
    }

    if (isNaN(result)) return Number(a);
    return result;
}

function checkResult(result) {
    return (Number.isFinite(result) && result > MIN_VALUE && result < MAX_VALUE);
}

function returnSpecialValues(a, b, arr) {
    if (/[enp]+/.test(a) && a.length > 2) a = a.slice(1);
    if (/[enp]+/.test(b) && b.length > 2) b = b.slice(1);
    if (a && /[enp]/.test(a[0])) a = arr[a[1]];
    if (b && /[enp]/.test(b[0])) b = arr[b[1]];

    return [a, b];
}

function returnOperationsResults(expression, arr) {
    while (/r/.test(expression)) {
        let index = expression[expression.indexOf(`r`) + 1];
        expression = expression.replace(`r${index}`, arr[index]);
    }

    return removeExcessOperators(expression);
}
  
function findSpecialValues(arr, expression) {
    let regForExp = /\d+\.?\d*e[\+\-]\d+/;
    let regForNegative = /(^\-\d+\.?\d*e[\+\-]\d+)|(^\-\d+\.?\d*)|([\(\+\-\*\/\^]\-\d+\.?\d*e[\+\-]\d+)|([\(\+\-\*\/\^]\-\d+\.?\d*)/;
    let value = ``;
    expression = removeExcessOperators(expression);

    while (regForNegative.test(expression)) {
        value = expression.match(regForNegative)[0].split(``);
        if ( /[\(\+\*\/\^]/.test(value[0])) value.shift();
        arr.push(value.join(``));
        expression = expression.replace(value.join(``), `n${arr.length - 1}`);
    }
    while (regForExp.test(expression)) {
        value = expression.match(regForExp)[0];
        arr.push(value);
        expression = expression.replace(value, `e${arr.length - 1}`);
    }

    return [arr, expression]
}

function operate(operator, a, b) {
    switch(operator) {
        case `+`: return add(a, b);
        case `-`: return subtract(a, b);
        case `*`: return multiply(a, b);
        case `/`: return division(a, b);
        case `^`: return power(a, b);
    }
}

function add (a, b) {
	return (a + b);
}

function subtract (a, b) {
	return (a - b);
}

function multiply(a, b) {
    return (a * b);
}

function division (a, b) {
    return (a / b);
}

function power(a, b) {
	return (Math.pow(a, b));
}

function factorial(a) {
	let result = 1;
	for(let i = 1; i <= a; i++) {
		result *= i;
    }
    
	return result;
}

function round(value,decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
function expo(x, f) {
    return Number.parseFloat(x).toExponential(f);
}