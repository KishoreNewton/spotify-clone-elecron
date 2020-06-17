const electron = require('electron')
const { app, BrowserWindow, Menu } = electron

let mainWindow
let addWindow

app.on('ready', () => {
    mainWindow = new BrowserWindow({})
    mainWindow.loadURL(`https://www.kishorenewton.com/portfolio/music/index.php`)
    mainWindow.setMenu(null)
})
