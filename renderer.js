const rocky = document.getElementById("rocky");
const { ipcRenderer } = require("electron");

const walkframes = [
    "assets/walk1.png",
    "assets/walk2.png"
];
const jazzframes=[
    "assets/jazz1.png",
    "assets/jazz2.png"
]
const ballframes=[
    "assets/ball.png"
]

let walkframe = 0;
let jazzframe = 0;
let hovering=0;



let canwalk=false;
ipcRenderer.on("walking-mode", (event, walk) => {

    canwalk = walk;

});
// walking 
setInterval(() => {
    if(!canwalk){
        rocky.src=ballframes[0];

    }
    else if(hovering==1){
        rocky.src=jazzframes[jazzframe];
        jazzframe    = (jazzframe + 1) % jazzframes.length;
    }
    else {
        rocky.src = walkframes[walkframe];
        walkframe = (walkframe + 1) % walkframes.length;
    }
    
}, 150);


// cursor jazz hands
rocky.addEventListener("mouseenter", () => {
    hovering=1;
});
rocky.addEventListener("mouseleave", () => {
    hovering=0;
});

// ----------------------------
// Movement
// ----------------------------

const screenWidth = window.screen.availWidth;
const screenHeight = window.screen.availHeight;

const rockyWidth = 120;
const rockyHeight = 120;

let x = 2;
let y = screenHeight - rockyHeight;

let speed = 2;

function move() {

    
    if(canwalk){x += speed;}
    else x=2;

    if (x <= 0) {
        speed = 2;
        rocky.style.transform = "scaleX(1)";
    }

    if (x >= screenWidth - rockyWidth) {
        speed = -2;
        rocky.style.transform = "scaleX(-1)";
    }

    ipcRenderer.send("move-rocky", x, y);

    requestAnimationFrame(move);
}

move();