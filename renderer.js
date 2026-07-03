const { ipcRenderer } = require("electron");
const AnimationController = require("./AnimationController");
const { StateMachine, events } = require("./StateMachine");

const rocky = document.getElementById("rocky");
const bubble = document.getElementById("bubble");

const ctrl = new AnimationController(
    rocky,
    bubble,
    ipcRenderer
);

const fsm = new StateMachine(ctrl);

ctrl.idle();

ipcRenderer.on("desktop", () => {
    fsm.handleEvent(events.DESKTOP);
});

ipcRenderer.on("vscode", () => {
    fsm.handleEvent(events.VSCODE);
});

ipcRenderer.on("git", () => {
    fsm.handleEvent(events.GIT);
});

ipcRenderer.on("battery-low", () => {
    fsm.handleEvent(events.LOW_BATTERY);
});

ctrl.onwalkingfinished(() => {
    fsm.handleEvent(events.WALK_COMPLETE);
});

ctrl.ontalkfinished(() => {
    fsm.handleEvent(events.TALK_COMPLETE);
});

ctrl.oncelebrationfinished(() => {
    fsm.handleEvent(events.CELEBRATE_COMPLETE);
});