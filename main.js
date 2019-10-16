const { app, BrowserWindow, nativeImage, Tray, Menu } = require('electron');

let win, tray, menu;
let trayWindow;

function createMainWindow() {
    win = new BrowserWindow({ width: 1200, resizable: true });
    win.loadFile('index.html')
    win.on('closed', () => {
        win = null
    })

    let logo = nativeImage.createFromPath('img/icon.png');
    win.setIcon(logo);


    generateMenu();
    generateTray();
}

function createTrayWindow() {
    const {width, height} = require('electron').screen.getPrimaryDisplay().workAreaSize;
    let locationX = width - 300;
    let locationY = height - 210;
    trayWindow = new BrowserWindow({ width: 200, height: 200, x: locationX, y: locationY, resizable: false, frame: false });
    trayWindow.loadFile("widget.html");
    trayWindow.setMenu(null);
}

function generateTray() {
    tray = new Tray('img/icon.png')

    tray.setToolTip('Weather Man.');

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio', checked: true },
        { label: 'Item4', type: 'radio' }
    ]);

    tray.on('click', () => {
        createTrayWindow();
        win.isVisible() ? win.hide() : win.show()
    });
    win.on('show', () => {
        tray.setHighlightMode('always')
    });
    win.on('hide', () => {
        tray.setHighlightMode('never')
    });

    tray.setContextMenu(contextMenu);

}

function generateMenu() {
    const contextMenu = Menu.buildFromTemplate([

        { label: 'Item3', type: 'checkbox', checked: true },
        { label: 'Item4', type: 'radio' },
        { label: 'Item2', type: 'separator' },
        { label: 'Item5', type: 'normal' },
        { label: 'Item6', type: 'normal' },
        { label: 'Item7', type: 'normal' }
    ]);

    Menu.setApplicationMenu(contextMenu);
}

app.on('ready', createMainWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createMainWindow();
    }
})