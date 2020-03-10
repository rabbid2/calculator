let savedValue = ``;

//Здесь создаются все элементы интерфейса и находятся функции для управления ими.
function createInterface() {
    let input = createElem(`input`, [`inputField`], `.calculator`, ``, ``);
    input.addEventListener(`keydown`, enter);
    input.addEventListener(`keyup`, checkInput);

    createButtons();

    let message = createElem(`input`, [`message`], `.calculator`, ``, ``);
    message.setAttribute(`readonly`,`readonly`);

    let info1 = createElem(`span`, [`left-info`], `.calculator`, `Information`);
    let info2 = createElem(`span`, [`right-info`], `.calculator`, `Information`);
    info1.addEventListener(`mousedown`, showInfo);
    info2.addEventListener(`mousedown`, showInfo);
}

function createElem(elem, classNames, parentClassName, text, index, func) {
    let item = document.createElement(elem);
    classNames.forEach( className => item.classList.add(className));
    item.textContent = text;
    item.setAttribute(`style`, `grid-area: ${classNames[0][0] + index}`);
    if (elem === `button`) item.addEventListener(`click`, func);
    document.querySelector(parentClassName).appendChild(item);

    return item;
}

function createButtons(){
    let btn = `button`;
    for (let i = 0; i < 10; i++) createElem(`button`, [`number${i}`], `.calculator`, `${i}`, i, checkInput);
    for (let i = 0; i < operators.length; i++) createElem(`button`, [`operation${i}`, `operations`], `.calculator`, `${operators[i]}`, i, checkInput);
    createElem(`button`, [`e`], `.calculator`, `e`, ``, checkInput);
    createElem(`button`, [`enter`, `operations`], `.calculator`, `=`, `n`, enter);
    createElem(`button`, [`bkt-open`], `.calculator`, `(`, `o`, checkInput);
    createElem(`button`, [`bkt-close`], `.calculator`, `)`, `c`, checkInput);
    createElem(`button`, [`pi`], `.calculator`, `π`, `i`, checkInput);
    createElem(`button`, [`dot`], `.calculator`, `.`, ``, checkInput);
    createElem(`button`, [`cos`, `operations`], `.calculator`, `cos`, ``, checkInput);
    createElem(`button`, [`sin`, `operations`], `.calculator`, `sin`, ``, checkInput);
    createElem(`button`, [`exp`, `operations`], `.calculator`, `EXP`, `x`, checkInput);
    createElem(`button`, [`log`, `operations`], `.calculator`, `log`, `g`, checkInput);
    createElem(`button`, [`clear`], `.calculator`, `clear`, `l`, clear);
    createElem(`button`, [`save`], `.calculator`, `save value`, `v`, saveValue);
    createElem(`button`, [`return`], `.calculator`, `return value`, ``, returnValue);
}

function showInfo(e) {
    if (this.classList.contains(`left-info`)) {
        let text = `<ul>Доступные операции: <li>"(a+b)" - сложение</li><li>"(a-b)" - вычитание</li><li>"(a*b)" - умножение</li><li>"(a/b)" - деление</li><li>"(a^b)" - возведение в степень</li><li>"сos(rad)" - косинус</li><li>"sin(rad)" - синус</li><li>"EXP(a)" - экспонента</li><li>"log(a)n" - натуральный логарифм (по основанию <i>e</i>)</li><li>"log(a)d" - десятичный логарифм (по основанию 10)</li><li>"log(a)b" - логарифм по основанию b, b - вещественное число: b > 0 и b ≠ 1<br>Пример: "log(8)2 = 3"</li><li>Основание b можно ввести только в виде целого числа или числа с плавающей точкой</li><li>Аргумент логарифма (a) > 0</li></ul>`;
        setInfo(this, `show-left-info`, text);
    }
    else {
        let text = `<ul><li>Допустимый диапазон значений: от ${MIN_VALUE} до ${MAX_VALUE}</li><li>Число "π" с клавиатуры можно ввести как "p"</li><li>Формы записи чисел:<br>с плавающей точкой (1.2),<br>экспоненциальная (12e-1)</li><li>В качестве разделителя целой и дробной части принимается только "."</li><li>Взятие квадратного корня производится операцией: "^(1/2)"</li><li>Формула перевода градусов в радианы: "rad = a° * π / 180"</li></ul>Исправить введенное выражение можно только с помощью клавиатуры.<p>Будьте внимательны при написании больших выражений!</p>`
        setInfo(this, `show-right-info`, text);
    }
}

function setInfo(item, className, str) {
    item.classList.toggle(className);
    if (item.classList.contains(className)) {
        item.textContent=``;
        setTimeout(() => { item.innerHTML = str; }, 500);
    }
    else item.textContent = `Information`;
}

function getInput() {
    let inputField = document.querySelector(`.inputField`);
    let text = inputField.value;

    return text;
}

function setInput(text) {
    let inputField = document.querySelector(`.inputField`);
    if (text !== undefined) inputField.value = text;
    inputField.focus();
}

function setMessage(text) {
    let messageField = document.querySelector(`.message`);
    messageField.value = text;
}

function setError(text) {
    let inputField = document.querySelector(`.inputField`);
    inputField.classList.add(`error`);
    setMessage(text);
}

function resetError() {
    let inputField = document.querySelector(`.inputField`);
    inputField.classList.remove(`error`);
}

function clear(e) {
    setInput(``);
}

function saveValue(e) {
    let input = getInput();
    if (checkValue(input)) savedValue = input;
    else setError(`Для сохранения необходимо число`);
}

function returnValue(e) {
    setInput(getInput() + savedValue);
}

//Проверка числа для кнопки сохранения
function checkValue(text) {
    return /(^\-?\d+\.?\d*$)|(^-?\d+\.?\d*e[\+\-]\d+$)/.test(text);
}