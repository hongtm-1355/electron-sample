require("@babel/core").transform("code", {
  plugins: ["transform-es2015-destructuring", "@babel/plugin-proposal-class-properties"]
});
const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron')
const path = require('path');
const Store = require('electron-store');
const clipboardy = require('clipboardy');
const fs = require('fs');
const store = new Store();

let mainWindows
let tray = null
// {type:'separator'},

function generateID() {
  return (new Date()).getTime() + '-' + Math.random().toString(16).slice(2)
}

function createTray () {
  tray = new Tray(path.join(__dirname, '/img/icon.png'));
  tray.setToolTip('hello')
  taskMenu = Menu.buildFromTemplate([
      { label: "hi lu 1", click: () => {
        // console.log(copy)
        clipboardy.writeSync('1')
      } },
      { label: "hi lu 2" },
      { label: "hi lu 3" },
      { type: "separator" },
      { label: "Manager" },
  ]);
  tray.setContextMenu(taskMenu)
}

function createWindows () {
  mainWindows = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    }
  })

  // store.set('hong', 'dep trai')

  mainWindows.loadFile('index.html');
  mainWindows.setMenu(null)
  mainWindows.openDevTools();
}

ipcMain.on('load-file', (event, raw) => {
  let foobar = app.getPath('appData')
  fs.writeFile(foobar+'/nhap.html', raw, (err) => {
    if (err) throw err;
    event.returnValue = foobar+'/nhap.html'
  });
})

ipcMain.on('add-collection', (event, arg) => {
  const items = store.get("collections")
  const id = generateID()
  items.push({ id: id, title: arg.title, items: arg.items })
  store.set("collections", items)
  event.returnValue = { id: id, title: arg.title, items: [] }
})

ipcMain.on('get-collections', (event, arg) => {
  event.returnValue = store.get("collections")
})

ipcMain.on('get-collection', (event, arg) => {
  event.returnValue = store.get("collections").filter(i => i.id === arg)
})

ipcMain.on('edit-collection', (event, arg) => {
  const items = store.get("collections")
  const item = items.filter(i => i.id == arg.id)
  if(item) {
    store.get("collections", items.map(i => i.id === item.id ? {...item, title: arg.title} : i))
    event.returnValue = true
  } else {
    event.returnValue = false
  }
})

ipcMain.on('remove-collection', (event, arg) => {
  const items = store.get("collections").filter(i => i.id !== arg)
  store.set("collections", items)
  event.returnValue = true
})

ipcMain.on('open-child', (event, arg) => {
  const child = new BrowserWindow({ width: 100, height: 100, parent: mainWindows, webPreferences: {
    nodeIntegration: true
  }, modal: true})
  child.loadFile('index.html');
  child.show();
})

app.on('ready', function() {
  createWindows()
})
