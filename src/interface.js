function createInterface() {
    let input = createElem(`input`, [`textField`], `.grid`, ``);
    input.setAttribute(`style`, `grid-area: i`);
    input.addEventListener(`keydown`, enter);
    input.addEventListener(`keyup`, checkInput);

    for (let i = 0; i < 10; i++) createElem(`button`, [`number${i}`], `.calculator`, `${i}`, i);
    for (let i = 0; i < operators.length; i++) createElem(`button`, [`operation${i}`], `.calculator`, `${operators[i]}`, i);
    createElem(`button`, [`e`], `.calculator`, `e`, ``);
    createElem(`button`, [`enter`], `.calculator`, `=`, `n`);
    createElem(`button`, [`bkt-open`], `.calculator`, `(`, `o`);
    createElem(`button`, [`bkt-close`], `.calculator`, `)`, `c`);
    createElem(`button`, [`pi`], `.calculator`, `π`, `i`);
    createElem(`button`, [`dot`], `.calculator`, `.`, ``);

    let message = createElem(`div`, [`message`], `.calculator`, `Привет!`);
    message.setAttribute(`style`, `grid-area: m`);

    let info1 = createElem(`span`, [`info1`], `.calculator`,`Info`);
    let info2 = createElem(`span`, [`info2`], `.calculator`,`Info`);
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
        let text = `<ul>Операции: <li>"+" - сложение</li><li>"-" - вычитание</li><li>"*" - умножение</li><li>"/" - деление</li><li>"^" - возведение в степень</li><br>Исправить введенное выражение можно только с помощью клавиатуры. Будьте внимательны при написании!`;
        setInfo(this,`show1`,text);
    }
    else {
        let text = `<ul><li>Допустимый диапазон значений:<br>от ${MIN_VALUE}<br>до ${MAX_VALUE}</li><li>Формы записи вещественных чисел:<br>с плавающей точкой (1.2),<br>экспоненциальная (12e-1)</li><li>В качестве точки принимается только "."</li><li>Взятие квадратного корня производится операцией "^(1/2)"</li></ul>`
        setInfo(this, `show2`, text);
    }
}

function setInfo(item, className,str){
    item.classList.toggle(className);
    if (item.classList.contains(className)) {
        setTimeout(()=>{item.innerHTML=str;},500);
    }
    else item.textContent=`Info`;
}