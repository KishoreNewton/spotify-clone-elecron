const electron = require('electron')

const { app, BrowserWindow, Menu, ipcMain } = electron

let mainWindow
let addWindow

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
          nodeIntegration: true
        }
    })
    mainWindow.loadURL(`file://${__dirname}/index.html`)
    mainWindow.on('closed', () => app.quit())
    const mainMenu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(mainMenu)
})

console.log(app.name)

function createAddWindow(){
    addWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 300,
        height: 200,
        title: 'Add New Todo'
    })
    addWindow.loadURL(`file://${__dirname}/add.html`)
    addWindow.on('closed', () => {
        addWindow = null
    })
}

ipcMain.on('todo:add', (event, todo) => {
    mainWindow.webContents.send('todo.add', todo)
    addWindow.close()
    
})

const isMac = process.platform === 'darwin'

const menuTemplate = [
    ...(isMac ? [{
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }] : []),
    {
        label: 'File',
        submenu: [
            {
                label: 'New Todo',
                click() {
                    createAddWindow()
                }
            },
            {
                label: 'Clear Todo',
                click(){
                    mainWindow.webContents.send('todo:clear')
                }
            },
            {
                label: 'quit',
                accelerator: isMac ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit()
                },
            }
        ]

    }
]

if(process.env.NODE_ENV !== 'production'){
    menuTemplate.push({
        label: 'View',
        submenu: [
            {
                role: 'reload'
            },
            {
                label: 'toggle Developer Tools',
                accelerator: isMac ? 'Command+Alt+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools()
                }
            }
        ]
    })
}