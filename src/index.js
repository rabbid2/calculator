const operators = [`^`,`*`,`/`,`+`,`-`];
createInterface();


function createInterface() {
    let input = createElem(`input`, [`textField`], ``);
    input.addEventListener(`keydown`, enter);
    input.addEventListener(`keyup`, checkInput);
    createElem(`div`, [`buttons`, `grid`], ``);
    for (let i = 0; i < 10; i++) createElem(`button`, [`number${i}`], `${i}`, i);
    for (let i = 0; i < operators.length; i++) createElem(`button`, [`operation${i}`], `${operators[i]}`, i);
    createElem(`button`, [`e`], `e`, ``);
    createElem(`button`, [`enter`], `=`, `n`);
    let message = createElem(`div`, [`message`], ``);
    message.setAttribute(`style`, `grid-area: m`);
}

function createElem(elem, classNames, text, index) {
    let item = document.createElement(elem);
    classNames.forEach( className => item.classList.add(className));
    item.textContent = text;
    if (elem === `button`) {
        item.setAttribute(`style`, `grid-area: ${classNames[0][0] + index}`);
        if (text === `=`) item.addEventListener(`click`, enter);
        else item.addEventListener(`click`, checkInput);
        document.querySelector(`.buttons`).appendChild(item);
    }
    else document.querySelector(`.calculator`).appendChild(item);

    return item;
}

function checkInput(e) {
    symbolArray = getInput().split(``);
    if (this.textContent) symbolArray.push(this.textContent);
    let lastCoupleSymbols = getLastСoupleSymbols(symbolArray);

    if (!checkLastSymbol(lastCoupleSymbols[0], lastCoupleSymbols[1])) symbolArray.pop();

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

function checkLastSymbol(currentSymbol, previousSymbol) {
    if (currentSymbol === `.`) return checkDot();

    let regForFirstSymbol = /[\-\(\d]/;
    let regForSymbol = /(^\d*$)|(^\d*[.\)\+\-\*\/\^e]?$)|(^[.\(\+\-\*\/\^]?\d*$)|(^\)?[\)\(\+\-\*\/\^]?$)|(^[\)\(\+\-\*\/\^]?\(?$)|(^e[\-\+]$)|(^\(\-$)|(^[\-\+]\-$)/;
    
    if (previousSymbol) return regForSymbol.test(previousSymbol+currentSymbol);
    else return regForFirstSymbol.test(currentSymbol);
}

function checkDot() {
    let array = getInput().split(``);
    let regForDot = /^\-?([\(\)]*[\-\+]?(\d+|\d+\.\d+|\d+\.?\d*e[\+\-]\d+)[\+\-\*\/\^\)][\)\(]*[\-\*\+\^]?)*\d+$/;
    let newArr = array.concat();
    newArr.pop();
    let text = newArr.join(``);

    return regForDot.test(text);
}

function enter(e) {
    if(e.type !== `click` && e.code !== `Enter`) return;
    let text = getInput();
    
    if (checkSpaces(text)) {
        alert(`Удалите пробелы`);
        return;
    }
    if (checkString(text)) {
        alert(`Неправильный ввод`);
        return;
    }
    if (!checkParentheses(text)) {
        alert(`Не все скобки закрыты`);
        return;
    }
    let result = calculateFullExpression(text);
    setInput(result);
}

function checkString(text) {
    let reg = /([^\d\+\-\*\/\^\.\)\(e]+|[\*\/\^\.e]{2})/;
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

function calculateFullExpression(input) {
    let regForParentheses = /\([^\(\)]*\)/;
    let singleExpressionResults = [];
    input = removeExcessOperators(input);

    while (regForParentheses.test(input) || /.[\+\-\*\/\^]+./.test(input)){
        let expression = input;
        if (regForParentheses.test(input)) {
            expression = input.match(regForParentheses)[0];
        }
        let newExpression = returnOperationsResults(expression, singleExpressionResults);
        input = input.replace(expression, newExpression);
        let result = calculate(newExpression);

        singleExpressionResults.push(result);
        input = input.replace(newExpression, `r${singleExpressionResults.length-1}`);
        input = removeExcessOperators(input);
    }

    return returnOperationsResults(input, singleExpressionResults);
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
            
            if (!Number.isFinite(result)) {
                if (operator === `/` && Number(b) === 0) alert(`Деление на 0`);
                else alert(`Превышен лимит`);
                return;
            }
        }
    }

    if (isNaN(result)) return Number(a);
    return result;
}
  
function returnSpecialValues(a, b, arr) {
    if (/[enp]+/.test(a) && a.length > 2) a = a.slice(1);
    if (/[enp]+/.test(b) && b.length > 2) b = b.slice(1);
    if (a && /[enp]/.test(a[0])) a = arr[a[1]];
    if (b && /[enp]/.test(b[0])) b = arr[b[1]];

    return [a,b];
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
	return a + b;
}

function subtract (a, b) {
	return a - b;
}

function multiply(a, b) {
    return a * b;
}

function division (a, b) {
    return a / b;
}

function power(a, b) {
	return Math.pow(a, b);
}

function factorial(a) {
	let result = 1;
	for(let i = 1; i <= a; i++) {
		result *= i;
    }
    
	return result;
}

