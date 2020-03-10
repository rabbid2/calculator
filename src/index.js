const operators = [`^`,`*`,`/`,`+`,`-`];
const MAX_VALUE = 1e+300;
const MIN_VALUE = -MAX_VALUE;
const PI = Math.PI;
let logBase = ``;

createInterface();

//Набор функций для проверки последнего введенного символа по событию `keyup`.

//Функция содержит проверку для кнопок матем. функций и три проверки для последнего символа: 
//если это точка или основание для логарифма, то проверяется вся введенная строка, если нет, 
//то проверяются только комбинации последнего символа с предыдущим.
//Если проверка не проходит, то символ удаляется из строки. В результате строка возвращается в поле ввода.
function checkInput(e) {
    symbolArray = getInput().split(``);
    if (this.textContent) symbolArray.push(this.textContent);
    let lastСoupleSymbols = getLastСoupleSymbols(symbolArray);  
    let currentSymbol = lastСoupleSymbols[0];
    let previousSymbol = lastСoupleSymbols[1];

    let dot = currentSymbol === `.`;
    let log = previousSymbol === `)` && (currentSymbol === `d` || currentSymbol === `n` || /\d/.test(currentSymbol));
    let mathFunction = this.textContent === `EXP` || this.textContent === `log` || 
                        this.textContent === `cos` || this.textContent === `sin`;

    if (mathFunction && previousSymbol && !(/[\(\+\-\*\/\^]/.test(previousSymbol)) || 
        log && !checkLog() || dot && !checkDot(symbolArray) || 
        !mathFunction && !log && !checkLastSymbol(currentSymbol, previousSymbol)) symbolArray.pop();

    setInput(symbolArray.join(``));
}

function getLastСoupleSymbols(symbolArray) {
    let currentSymbol = ``;
    let previousSymbol = ``;

    if (symbolArray.length > 0) currentSymbol = symbolArray[symbolArray.length - 1];
    if (symbolArray.length > 1) previousSymbol = symbolArray[symbolArray.length - 2];

    return [currentSymbol, previousSymbol];
}

//Функция с помощью регулярного выражения проверяет последние два символа на соответствие допустимым комбинациям. 
//Если введенный символ первый, то проверяется регулярное выражение для начала строки.
function checkLastSymbol(currentSymbol, previousSymbol) {
    let regForFirstSymbol = /[\-\(\d\πpcsEl]/;
    let regForSymbol = /(^\d*$)|(^\d\.$)|(^\.\d$)|(^[\d\πp][\)\+\-\*\/\^e]$)|(^[\(\+\-\*\/\^][\d\πp]$)|(^\)[\)\+\-\*\/\^]$)|(^[\(\+\-\*\/\^Psng]\($)|(^e[\-\+]$)|(^\(\-$)|(^[\-\+]\-$)|(^[snP][\d\πp\(]$)|(^co$)|(^os$)|(^si$)|(^in$)|(^EX$)|(^XP$)|(^lo$)|(^og$)|(^[\(\+\-\*\/\^][cslE]$)|(^[dn][\+\-\*\/\^\)]$)/;
    
    if (previousSymbol) return regForSymbol.test(previousSymbol + currentSymbol);
    else return regForFirstSymbol.test(currentSymbol);
}

//Функция предназначена для проверки ввода основания логарифма после закрывающей скобки. 
//Она проверяет всю строку на наличие функции логарифма перед открывающей скобкой соответствующей данной закрывающей.
function checkLog() {
    let input = getInput();
    let countBkts = 1;

    for (let i = input.length - 3; i > 0; i--) {
        if (input[i] === `)`) countBkts++;
        if (input[i] === `(`) {
            countBkts--;
            if (countBkts === 0) return(input[i - 1] === `g` && input[i - 2] === `o` && input[i - 3] === `l`);
        }
    }

    return false;
}

//Функция проверяет строку до введенной точки.
function checkDot(array) {
     let regForDot = /^(\(?-?[\(cosinEXPlg\+\-]*(\d+\.?\d*|\d+\.?\d*e[\+\-]\d+|[\πp])[dn\)\+\-\*\/\^]+)*[\(cosinEXPlg\+\-]*\d+$/;
     let newArr = array.concat();
     newArr.pop();
     let text = newArr.join(``);

     return regForDot.test(text);
}

//Набор функций для итоговой проверки и расчетов.

//Функция содержит общую проверку введенной строки по событиям `keydown` на клавишах Enter 
//и `click` на кнопке `=`. После проверок ищется результат введенного выражения, который возвращается в поле ввода.
function enter(e) {
    if (e.type !== `click` && e.code !== `Enter` && e.code !== `NumpadEnter`) return;
    let expression = getInput();
    resetError();
    if (!checkFullExpression(expression)) return;
    let result = calculateFullExpression(expression);

    setInput(result);
}

//Функция содержит серию проверок на пробелы, точки, круглые скобки, повторяющиеся и неподдерживаемые расчетами символы.
function checkFullExpression(expression) { 
    let errorMessage=``;
    if (!checkSpaces(expression)) errorMessage =`Удалите пробелы`;
    else if (!checkDots(expression)) errorMessage = `Неправильно поставлена точка`;
    else if (!checkString(expression)) errorMessage = `Некорректный ввод`;
    else if (!checkParentheses(expression)) errorMessage = `Не все скобки закрыты`;

    if (errorMessage) { 
        setError(errorMessage);
        return false;
    }
    setMessage(expression);
    return true;
}

function checkDots(text) {
    let reg = /(\d*\.+\d*\.+)|([\(\)cosine\πpEXPlgd\^\*\/\+\-]\.)|(\.[\(\)cosine\πpEXPlgd\^\*\/\+\-])/;
    return !reg.test(text);
}

function checkString(text) {
    let reg = /([^\d\+\-\*\/\^\.\)\(e\πpcosinEXPlgd]+|[\*\/\^\.e]{2}|[\πpcsnEPlgd]{2,}|[oi]{2,}|[a-zA-Z]{4,}|e\d|\d+\.?\d*e[+-]\d+\.?\d*e\d*|\d+[sincolgEXP]\d+)/;
    return !reg.test(text);
}

function checkSpaces(text) {
    return !(/\s/.test(text));
}

function checkParentheses(text) {
    let array = text.split(``);
    let countOpen = 0;
    let countClose = 0;
    for (let symbol of array) {
        if (symbol === `(`) countOpen++;
        else if (symbol === `)`) countClose++;
    }

    return countOpen === countClose;
}

//Этот фрагмент кода содержит расчет полного введенного выражения. Разделить на маленькие функции не удалось :(
//В общем выражении ищутся отдельные выражения в скобках. Каждый такой фрагмент считается и результат возвращается 
//в общее выражение на место скобочного выражения. Если скобок нет, то выражение считается 1 раз. 
//Перед расчетом скобочного выражения запоминается его индекс и проверяется, была ли перед скобками математическая функция. 
//Если да, то она сохраняется. После вычисления выражения в скобках, применяется вычисление математической функции(если она есть) 
//для результата. Функция возвращает число во всех случаях, кроме случая появления ошибок при расчете выражения.
function calculateFullExpression(input) {
    let regForParentheses = /\([^\(\)]*\)/;
    let mathFunction = ``;
    let indexExpression = 0;
    input = addPi(input);
    input = removeExcessOperators(input);

    while (regForParentheses.test(input) || /[^e][\+\-\*\/\^]+./.test(input)) {
        let expression = input;
        if (regForParentheses.test(input)) {
            indexExpression = input.search(regForParentheses);
            expression = input.match(regForParentheses)[0];
            mathFunction = findMathFunction(input, indexExpression);
        }
        let result = calculate(expression);

        if (mathFunction) {
            expression = addMathFunction(input, indexExpression, expression);
            if (mathFunction === `g` && (!checkLogValue(result) || !checkLogBase())) return input;
            result = getMathFunc(result, mathFunction);
            mathFunction =``;
            indexExpression=0;
        }
        if (result === ``) return input;

        input = input.replace(expression, result);
        input = removeExcessOperators(input);
    }

    return input;
}

//Проверка, есть ли перед скобками функция.
function findMathFunction(input, index) {
    let mathFunction = ``;
    if (input[index - 1] && /[nsgPg]/.test(input[index - 1])) mathFunction = input[index - 1];

    return mathFunction;
}

//Таким нехитрым образом к строке скобочного выражения добавляется слово математической функции, состоящее из 3х символов. 
//Если это логарифм, то добавляется его основание.
function addMathFunction(input, index, expression) {
    let base = ``;
    if(input[index - 1] === `g`){
        for(let i = index + expression.length; i < input.length; i++) {
            if (operators.includes(input[i]) || input[i] === ')') break;
            else base += input[i];
        }
    }
    logBase = base;
    expression = input.substr(index - 3, 3) + expression + base;

    return expression;
}

//Математическая функция определяется буквой перед скобкой, т.е. окончанием. По нему вызывается сама функция.
function getMathFunc(value, mathFunction) {
    switch (mathFunction) {
        case `n`: return sin(value);
        case `s`: return cos(value);
        case `P`: return exp(value);
        case `g`: return log(value);
    }
}

//Вставляет число пи в выражение вместо символа.
function addPi(text) {
    let regForPi = /[\πp]/;
    while (regForPi.test(text)) {
        text = text.replace(regForPi, PI);
    }

    return text;
}

//Функции с проверками основания и значения логарифма.
function checkLogBase() {
    if (logBase === `n` || logBase === `d`) return true;
    if (typeof(Number(logBase)) !== `number`) setError(`Неправильно ввведено основание логарифма`); 
    else if (Number(logBase) < 0) setError(`Основание логарифма должно быть больше 0`);
    else if (Number(logBase) === 1) setError(`Основание логарифма не должно быть равно 1`);
    else if (logBase === ``) setError(`Отсутствует основание у логарифма`);
    else return true;
    return false;
}

function checkLogValue(num) {
    if(num > 0) return true;
    setError(`Аргумент логарифма должен быть > 0`);
    return false;
}

//Функция удаления лишних операторов преобразует двойной оператор (++ +- --) в один (+ - +), 
//удаляется "+" в начале строки, в начале скобочного выражения и перед любым оператором.
function removeExcessOperators(text) {
    let regNeg = /(\+\-)|(\-\+)/;
    let regPos = /(\-\-)|(\+\+)/;
    let regExc1 = /(^\+)|([\+\-\*\/\^]$)/;
    let regExc2 = /(\(\+)/;
    while (regNeg.test(text) || regPos.test(text) || regExc1.test(text) || regExc2.test(text)) {   
        if (regNeg.test(text)) text = text.replace(regNeg, `-`);
        if (regPos.test(text)) text = text.replace(regPos, `+`);
        if (regExc1.test(text)) text = text.replace(regExc1, ``);
        if (regExc2.test(text)) text = text.replace(regExc2, `(`);
    }

    return text;
}

//Функция расчета выражения. Выражением считается любая последовательность, которая может быть и не быть заключена в скобки.
//В скобках может находиться простое число, поэтому добавлена проверка на отсутствие операторов.
//С помощью цикла перебора массива имеющихся операторов и цикла нахождения операторов в выражении 
//осуществляется поиск двух операндов и оператора, имеющего наивысший приоритет. 
//Перед поиском операции ищутся специальные значения, которые имеют оператор, который не должен использоваться 
//в бинарных операциях. Это числа с отрицательным знаком и в экспоненциальной форме. (-1, 1e+1). 
//Они сохраняются в массив и в выражении заменяются словами n{index}/e{index}, где индекс это их номер в массиве. 
//Если один из операндов будет состоять из такого слова, то его значение достается из массива и участвует в расчете операции.
//Циклы прерываются в 2х случаях - если закончились операторы в выражении, либо если последний оператор это специальное значение.
//Результат каждой операции возвращается в выражение. При каждом расчете результата производится его проверка на конечность, 
//NaN и соответствие диапазону. При ошибке функция возвращает пустую строку, иначе число.
function calculate(expression) {
    let a = ``;
    let b = ``;
    let result = 0;
    let param = [];
    let specialValues = [];
    if (!(/[\+\-\*\/\^]/.test(expression))) return getSingleValue(expression);

    for (let operator of operators) {
        while (expression.includes(operator)) {
            param = findSpecialValues(specialValues, expression);
            specialValues = param[0];
            expression = param[1];

            let operands = findOperands(expression, operator);
            a = operands[0];
            b = operands[1];
            let highestPriorityOperator = operands[2];

            operands = returnSpecialValues(a, b, specialValues);
            let aSV = operands[0];
            let bSV = operands[1];
            if (!a) {
                result = bSV;
                return result;
            }

            result = operate(highestPriorityOperator, Number(aSV), Number(bSV));
            expression = expression.replace(a + highestPriorityOperator + b, result.toString());
            
            if (!checkResult(result, highestPriorityOperator)) {
                if (highestPriorityOperator === `/` && Number(b) === 0) setError(`Деление на 0`);
                else setError(`Выход за пределы числового диапазона`);
                return ``;
            }
        }
    }

    if (isNaN(result)) return Number(a);
    return result;
}

//Функция ищет операнды. Одним из аргументов является оператор.
//Приоритет начального оператора зависит от расположения в массиве.
//Однако операторы (+,-) имеют одинаковый приоритет, в таком случае необходимо считать выражение слева направо.
//Для учета этого вызывается функция findOperatorIndex, которая возвращает первый индекс нахождения оператора 
//с приоритетом начального оператора. Далее находятся операнды с помощью циклов двигающихся от оператора 
//в разные стороны до другого оператора, скобки или конца строки. Возвращаются операнды и оператор.
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
    if( operator === `^` ) return indexOfOperator;
    if (regMultDiv.test(operator) || regMultDiv.test(expression)) indexOfOperator = expression.search(regMultDiv);
    else if (regAddSub.test(operator)) indexOfOperator = expression.search(regAddSub);
    
    return indexOfOperator;
}

//Функция убирает скобки в выражении, состоящем из одного числа и возвращает число.
function getSingleValue(expression) {
    let value = +(expression.slice(1, expression.length - 1));
    return value;
}

function checkResult(result) {
    return (!Number.isNaN(result) && Number.isFinite(result) &&  result > MIN_VALUE && result < MAX_VALUE);
}

//Достает специальное значение из массива. Код значения состоит из 2х символов, если их больше, то захвачена скобка, тогда она удаляется.
//Захватываться не должна, но удалять этот костыль не рискну.
function returnSpecialValues(a, b, arr) {
    if (/[en]+/.test(a) && a.length > 2) a = a.slice(1);
    if (/[en]+/.test(b) && b.length > 2) b = b.slice(1);
    if (a && /[en]/.test(a[0])) a = arr[a[1]];
    if (b && /[en]/.test(b[0])) b = arr[b[1]];

    return [a, b];
}

//Функция поиска значений с отрицательным знаком и в экспоненциальной форме. Заменяет их на слова n{index}, e{index}.
//Возвращается массив значений и обновленное выражение.
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

//Далее идут функции расчета значений.
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
	return round(a + b);
}

function subtract (a, b) {
	return round(a - b);
}

function multiply(a, b) {
    return round(a * b);
}

function division (a, b) {
    return round(a / b);
}

function power(a, b) {
	return round(Math.pow(a, b));
}

function cos(rad) {
    return round(Math.cos(rad));
}

function sin(rad) {
    return round(Math.sin(rad));
}

function exp(a) {
    return round(Math.exp(a));
}

function log(a) {
    if (logBase === `n`) return round(Math.log(a));
    if (logBase === `d`) return round(Math.log10(a));
    return round(Math.log(a) / Math.log(logBase));
}

//Функции убирают неточности вещественных чисел.
function round(num) {
    if (num.toString().includes(`e`)) return +(getValueFromExp(num).toFixed(14) + getExponentFromExp(num));
    return +(num.toFixed(14));
}

//Отделяем целую часть экспоненциальной формы, чтобы ее округлить.
function getValueFromExp(num) {
    let reg = /^-?\d+\.?\d*/;
    return +(num.toString().match(reg)[0]);
}

function getExponentFromExp(num) {
    let reg = /e[+-]\d+/;
    return num.toString().match(reg)[0];
}