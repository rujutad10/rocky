const { ipcRenderer } = require("electron");

const rocky = document.getElementById("rocky");
const bubble = document.getElementById("bubble");

const walkFrames = [
    "assets/walk1.png",
    "assets/walk2.png"
];

const jazzFrames = [
    "assets/jazz1.png",
    "assets/jazz2.png"
];

const ballFrame = "assets/ball.png";

const bubbleFrames = [
    "assets/science.png",
    "assets/encouragement.png"
];

let walkFrame = 0;
let jazzFrame = 0;
let bubbleFrame = 0;

let hovering = false;
let canWalk = false;

ipcRenderer.on("walking-mode",(event,walk)=>{

    canWalk = walk;

});

ipcRenderer.on("bubble",(event,show)=>{

    if(show){

        bubble.src = bubbleFrames[bubbleFrame];

        bubble.style.display = "block";

        bubbleFrame = (bubbleFrame + 1) % bubbleFrames.length;

    }

    else{

        bubble.style.display = "none";

    }

});

setInterval(()=>{

    if(!canWalk){

        rocky.src = ballFrame;

    }

    else if(hovering){

        rocky.src = jazzFrames[jazzFrame];

        jazzFrame = (jazzFrame + 1) % jazzFrames.length;

    }

    else{

        rocky.src = walkFrames[walkFrame];

        walkFrame = (walkFrame + 1) % walkFrames.length;

    }

},150);

rocky.addEventListener("mouseenter",()=>{

    hovering = true;

});

rocky.addEventListener("mouseleave",()=>{

    hovering = false;

});

const screenWidth = window.screen.width;
const screenHeight = window.screen.availHeight;

const WINDOW_HEIGHT = 260;

const rockyWidth = 160;

const baseY = screenHeight - WINDOW_HEIGHT;

let x = 2;
let y = baseY;

let speed = 2;

let bounce = 0;
function move(){

    if(canWalk){

        x += speed;

        y = baseY;

    }

    else{

        x = 2;

        bounce += 0.08;

        y = baseY + Math.sin(bounce) * 3;

    }

    if(x <= 0){

        speed = 2;
        rocky.style.transform = "scaleX(1)";

    }

    if(x >= screenWidth - rockyWidth){

        speed = -2;
        rocky.style.transform = "scaleX(-1)";

    }

    ipcRenderer.send("move-rocky", x, y);

    requestAnimationFrame(move);

}

move();