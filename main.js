const { app, BrowserWindow, screen, ipcMain } = require("electron");

let win;

const ROCKY_SIZE = 90;



function createWindow() {

    const display = screen.getPrimaryDisplay();
    const workArea = display.workArea;

    win = new BrowserWindow({
        width: ROCKY_SIZE,
        height: ROCKY_SIZE,
        x: 2,
        y: workArea.y + workArea.height - ROCKY_SIZE,

        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,
        skipTaskbar: true,

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile("index.html");
}

const activeWin = require("active-win");


async function checkActiveWindow() {

    const activeWindow = await activeWin();
     console.log(activeWindow);
    if(!win)return;
    if(activeWindow.title === "Program Manager" ||
        activeWindow.title.includes("File Explorer")){
    win.webContents.send("walking-mode",true);
}
else{
    win.webContents.send("walking-mode",false);
}


}
app.whenReady().then(() => {
    createWindow();
    setInterval(checkActiveWindow, 1000);
});


ipcMain.on("move-rocky", (event, x, y) => {
    if (win) {
        win.setPosition(Math.round(x), Math.round(y));
    }
});

app.on("window-all-closed", () => {
    app.quit();
});