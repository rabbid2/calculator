//Прыгающий кролик-кнопка
const jumpHeight = 30;
const jumpWidth = 35;
const rabbidSize = 50;
const padding = 4.6;
const requiredWidth = Math.max(jumpWidth, rabbidSize);
const windowHeight = document.documentElement.clientHeight - rabbidSize - padding;
const windowWidth = document.documentElement.clientWidth - rabbidSize - padding;
let side = {
    name:``,
    x:0,
    y:0,
    rotate: 0,
    setSide: function(name, x, y, rotate) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.rotate = rotate;
    },
}
let jump = true;

if (windowWidth > windowHeight && windowHeight - 700 > jumpWidth) { 
    window.addEventListener(`DOMContentLoaded`, runRabbid);
}

function runRabbid(e) {
    let rabbid = createElem(`button`, [`rabbid`], `body`, ``, ``, showContacts);
    rabbid.innerHTML = `<img src = src/rabbid.png alt = 'rabbid-logo'>`;
    rabbid.setAttribute(`style`, `top: ${windowHeight}px; left: ${windowWidth}px;
                                 -webkit-transform: rotate(90deg); 
                                 -ms-transform: rotate(90deg); 
                                 transform: rotate(90deg); 
                                 rotate:(90deg); display: block;`);
    setInterval(move, 200);
}

function move() {
    let rabbid = document.querySelector(`.rabbid`);
    let coords = getCoords(rabbid);
    let end = isEnd(coords);
    if (jump || end) setSide(rabbid, coords);
    else {
        moveDown();
        jump = true;
    }
    if (end) coords = getCoords(rabbid);
    step(rabbid, coords);
}

function moveDown() {
    if (Math.abs(side.x) === jumpHeight) side.x *= (-1);
    if (Math.abs(side.y) === jumpHeight) side.y *= (-1);
}

function step(rabbid, coords) {
    if (jump) jump = false;
    rabbid.setAttribute(`style`, `top: ${coords.top + side.y}px; left: ${coords.left + side.x}px;
                                -webkit-transform: rotate(${side.rotate}deg); 
                                -ms-transform: rotate(${side.rotate}deg); 
                                transform: rotate(${side.rotate}deg); 
                                rotate:(${side.rotate}deg); display: block;`);
}

function getCoords(elem) {
    let box = elem.getBoundingClientRect();
  
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset,
    };
}

function setSide(rabbid, coords) {
    if (coords.top <= requiredWidth && coords.left <=requiredWidth) {
        if (side.name !== `top`) setStartPosition(rabbid, `top`);
        side.setSide(`top`, jumpWidth, jumpHeight, 180);
    }
    else if (coords.top <= requiredWidth && coords.left >= windowWidth - requiredWidth) {
        if (side.name !== `right`) setStartPosition(rabbid, `right`);
        side.setSide(`right`, -jumpHeight, jumpWidth, 270);
    }
    else if (coords.top >= windowHeight - requiredWidth && coords.left >= windowWidth - requiredWidth) {
        if (side.name !== `bottom`) setStartPosition(rabbid, `bottom`);
        side.setSide(`bottom`, -jumpWidth, -jumpHeight, 0);
    }
    else if (coords.top >= windowHeight - requiredWidth && coords.left <= requiredWidth) {
        if (side.name != `left`) setStartPosition(rabbid, `left`);
        side.setSide(`left`, jumpHeight, -jumpWidth, 90);
    }
}

function setStartPosition(rabbid, sideName){
    if (sideName === `top`) {
        rabbid.style.left = padding + `px`;
        rabbid.style.top = padding + `px`;
    }
    else if (sideName === `right`) {
        rabbid.style.left = windowWidth + `px`;
        rabbid.style.top = padding + `px`;
    }
    else if (sideName === `bottom`) {
        rabbid.style.left = windowWidth + `px`;
        rabbid.style.top = windowHeight + `px`;
    }
    else if (sideName === `left`) {
        rabbid.style.left = padding + `px`;
        rabbid.style.top= windowHeight + `px`;
    }
}

function isEnd(coords) {
    return (side.name === `top` && coords.left >= windowWidth - requiredWidth || 
            side.name === `bottom` && coords.left <= requiredWidth || 
            side.name === `right` && coords.top >= windowHeight - requiredWidth || 
            side.name === `left` && coords.top <= requiredWidth);
}

function showContacts(e) {
    this.removeEventListener(`click`, showContacts);
    createElem(`div`, [`contacts`], `body`, ``, `t`);
    createElem(`p`, [`text-t`], `.contacts`, `@akuuu11`, `x`);
    createElem(`p`, [`text-g`], `.contacts`, `elenatonkikh7@gmail.com`, `m`);

    let telegram = createElem(`button`, [`contact`, `telegram`], `.contacts`, ``, `l`, showText);
    let gitHub = createElem(`a`, [`contact`], `.contacts`, ``, `h`);
    let gmail = createElem(`button`, [`contact`, `gmail`], `.contacts`, ``, `l`, showText);
    gitHub.setAttribute(`href`, `https://github.com/rabbid2/calculator`);

    gitHub.innerHTML = `<img class = 'icon' src = 'src/github.png' alt = 'GitHub'>`;
    telegram.innerHTML = `<img class = 'icon' src = 'src/telegram.png' alt = 'Telegram'>`;
    gmail.innerHTML = `<img class = 'icon' src = 'src/gmail.png' alt = 'Gmail'>`;
}

function showText(e) {
    if (this.classList.contains(`telegram`)) (document.querySelector(`.text-t`)).classList.toggle(`show-text`);
    else document.querySelector(`.text-g`).classList.toggle(`show-text`);
}