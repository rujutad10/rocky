const { app, BrowserWindow, screen, ipcMain } = require("electron");
const activeWin = require("active-win");

let win;

const WINDOW_WIDTH = 220;
const WINDOW_HEIGHT = 260;

let lastState = "";

function createWindow() {

    const display = screen.getPrimaryDisplay();
    const workArea = display.workArea;

    win = new BrowserWindow({
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT,

        x: 0,
        y: workArea.y + workArea.height - WINDOW_HEIGHT,

        frame: false,
        transparent: true,
        resizable: false,
        movable: false,
        skipTaskbar: true,

        alwaysOnTop: true,

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.setAlwaysOnTop(true, "screen-saver");
    win.setVisibleOnAllWorkspaces(true, {
        visibleOnFullScreen: true
    });
    win.setFullScreenable(false);

    win.loadFile("index.html");
}

async function checkActiveWindow() {

    if (!win) return;

    const activeWindow = await activeWin();

    if (!activeWindow) return;

    const title = activeWindow.title || "";

    let currentState = "";

    if (
        title === "Program Manager" ||
        title.includes("File Explorer")
    ) {

        currentState = "desktop";

    }
    else if (
        title.includes("Visual Studio Code")
    ) {

        currentState = "vscode";

    }

    if (currentState !== lastState) {

        lastState = currentState;

        if (currentState !== "") {

            console.log("Sending:", currentState);

            win.webContents.send(currentState);

        }
    }
}

app.whenReady().then(() => {

    createWindow();

    setInterval(checkActiveWindow, 1000);

});

ipcMain.on("move-rocky", (event, x, y) => {

    if (win) {

        win.setPosition(
            Math.round(x),
            Math.round(y)
        );

    }

});

app.on("window-all-closed", () => {

    app.quit();

});