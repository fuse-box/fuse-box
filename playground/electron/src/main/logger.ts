let win;

export function init(mainWin) {
  win = mainWin;
}

export function log(...data) {
  win.webContents.executeJavaScript("console.log('%cFROM MAIN', 'color: #800', '" + data + "');");
}
