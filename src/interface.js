function createInterface() {
    let input = createElem(`input`, [`textField`], `.grid`, ``);
    input.setAttribute(`style`, `grid-area: i`);
    input.addEventListener(`keydown`, enter);
    input.addEventListener(`keyup`, checkInput);

    for (let i = 0; i < 10; i++) createElem(`button`, [`number${i}`], `.calculator`, `${i}`, i);
    for (let i = 0; i < operators.length; i++) createElem(`button`, [`operation${i}`, `operations`], `.calculator`, `${operators[i]}`, i);
    createElem(`button`, [`e`], `.calculator`, `e`, ``);
    createElem(`button`, [`enter`, `operations`], `.calculator`, `=`, `n`);
    createElem(`button`, [`bkt-open`], `.calculator`, `(`, `o`);
    createElem(`button`, [`bkt-close`], `.calculator`, `)`, `c`);
    createElem(`button`, [`pi`], `.calculator`, `π`, `i`);
    createElem(`button`, [`dot`], `.calculator`, `.`, ``);
    createElem(`button`, [`cos`, `operations`], `.calculator`, `cos`, ``);
    createElem(`button`, [`sin`, `operations`], `.calculator`, `sin`, ``);
    createElem(`button`, [`exp`, `operations`], `.calculator`, `EXP`, `x`);
    createElem(`button`, [`log`, `operations`], `.calculator`, `log`, `g`);

    let message = createElem(`input`, [`message`], `.calculator`, ``);
    message.setAttribute(`style`, `grid-area: m`);
    message.setAttribute(`readonly`,`readonly`);

    let info1 = createElem(`span`, [`info1`], `.calculator`,`Infor`);
    let info2 = createElem(`span`, [`info2`], `.calculator`,`mation`);
    info1.addEventListener(`mousedown`,showInfo);
    info2.addEventListener(`mousedown`,showInfo);
}

function createElem(elem, classNames, parentClassName, text, index) {
    let item = document.createElement(elem);
    classNames.forEach( className => item.classList.add(className));
    item.textContent = text;
    if (elem === `button`) {
        item.setAttribute(`style`, `grid-area: ${classNames[0][0] + index}`);
        if (text === `=`) item.addEventListener(`click`, enter);
        else item.addEventListener(`click`, checkInput);
    }
    document.querySelector(parentClassName).appendChild(item);

    return item;
}

function showInfo(e){
    if(this.classList.contains(`info1`)) {
        let text = `<ul>Доступные операции: <li>"(a+b)" - сложение</li><li>"(a-b)" - вычитание</li><li>"(a*b)" - умножение</li><li>"(a/b)" - деление</li><li>"(a^b)" - возведение в степень</li><li>"сos(rad)" - косинус</li><li>"sin(rad)" - синус</li><li>"EXP(a)" - экспонента</li><li>"log(a)" - натуральный логарифм (по основанию <i>e</i>)</li><li>"rаd" - значение в радианах</li><li>Аргумент логарифма должен быть > 0</li><li>Допустимый диапазон значений:<br>от ${MIN_VALUE} до ${MAX_VALUE}</li></ul>`;
        setInfo(this,`show1`,text);
    }
    else {
        let text = `<ul><li>Число "π" с клавиатуры можно ввести как "p"</li><li>Формы записи вещественных чисел:<br>с плавающей точкой (1.2),<br>экспоненциальная (12e-1)</li><li>В качестве разделителя целой и дробной части принимается только "."</li><li>Взятие квадратного корня производится операцией: "^(1/2)"</li><li>Формула перевода градусов в радианы:<br> "1° * π / 180"</li></ul>Исправить введенное выражение можно только с помощью клавиатуры. Будьте внимательны при написании!`
        setInfo(this, `show2`, text);
    }
}

function setInfo(item, className,str){
    item.classList.toggle(className);
    if (item.classList.contains(className)) {
        item.textContent=``;
        setTimeout(()=>{item.innerHTML=str;},400);
    }
    else if (className[className.length-1] === `1`) item.textContent=`Infor`;
    else item.textContent=`mation`;
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
    messageField.value=text;
}

function setError(text) {
    let textField = document.querySelector(`.textField`);
    textField.classList.add(`error`);
    setMessage(text);
}

function resetError(){
    let textField = document.querySelector(`.textField`);
    textField.classList.remove(`error`);
}