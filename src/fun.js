if (window.screen.availWidth > window.screen.availHeight) window.addEventListener(`DOMContentLoaded`, runWalkingBlock);

function runWalkingBlock(e){
    let block = document.querySelector(`.feedback`);
    block.classList.add(`start`);
    //setInterval(move,1000);
}

function move(){
    let block = document.querySelector(`.feedback`);
    let sides=getSides();
    let oppositeSides=[getOpposite(sides[0]),getOpposite(sides[1])];
    let position=getPosition();
    block.removeAttribute(`style`);
    block.classList.remove(`start`);
    block.setAttribute(`style`, `${sides[0]}:${position[0]}px;${sides[1]}:${position[1]}px; display: block;`);
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSides(){
    let rnd =getRndInteger(1,2);
    let verticalSide=``;
    let horizontalSide=``;
    if (rnd===1) verticalSide=`top`;
    else verticalSide=`bottom`;
    rnd = getRndInteger(1,2);
    if (rnd===1) horizontalSide=`left`;
    else horizontalSide=`right`;

    return [verticalSide,horizontalSide];
}
function getPosition(){
    let pos1 = getRndInteger(-100,350);
    let pos2 = getRndInteger(-300,-500);

    return [pos1,pos2];
}

function getOpposite(side){
    if (side === `bottom`) return `top`;
    if (side === `top`) return `bottom`;
    if (side === `left`) return `right`;
    if (side === `right`) return `left`;
}