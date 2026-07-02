const { app, BrowserWindow, screen, ipcMain } = require("electron");
const activeWin = require("active-win");

let win;

const WINDOW_WIDTH = 220;
const WINDOW_HEIGHT = 260;

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
        skipTaskbar: true,
        movable: false,

        alwaysOnTop: true,

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Highest possible level
    win.setAlwaysOnTop(true, "screen-saver");
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    win.setFullScreenable(false);

    win.loadFile("index.html");
}

async function checkActiveWindow() {

    const activeWindow = await activeWin();

    if (!activeWindow || !win) return;

    if (
        activeWindow.title === "Program Manager" ||
        activeWindow.title.includes("File Explorer")
    ) {
        win.webContents.send("walking-mode", true);
        win.webContents.send("bubble", false);
    }

    else if (
        activeWindow.title.includes("Visual Studio Code")
    ) {
        win.webContents.send("walking-mode", false);
        win.webContents.send("bubble", true);
    }

    else {
        win.webContents.send("walking-mode", false);
        win.webContents.send("bubble", false);
    }
}

app.whenReady().then(() => {

    createWindow();

    setInterval(checkActiveWindow, 1000);

});

ipcMain.on("move-rocky", (event, x, y) => {

    if (win)
        win.setPosition(Math.round(x), Math.round(y));

});

app.on("window-all-closed", () => {
    app.quit();
});