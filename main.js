// main.js — HidroSmart Desktop (Electron)
const { app, BrowserWindow, shell, Menu, nativeImage, dialog } = require('electron');
const path  = require('path');
const fs    = require('fs');

// Previne múltiplas instâncias
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) { app.quit(); }

let mainWindow;

function createWindow() {
  const iconPath = path.join(__dirname, 'icons', 'icon-512.png');
  const icon     = fs.existsSync(iconPath) ? nativeImage.createFromPath(iconPath) : undefined;

  mainWindow = new BrowserWindow({
    width:  1200,
    height: 800,
    minWidth:  420,
    minHeight: 600,
    title:  'HidroSmart',
    icon,
    show: false,
    backgroundColor: '#eef5fc',
    webPreferences: {
      nodeIntegration:    false,
      contextIsolation:   true,
      webSecurity:        true,
      allowRunningInsecureContent: false,
    },
  });

  // Carrega o app local
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Abre links externos no browser padrão
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

// Segunda instância → foca a janela existente
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.whenReady().then(() => {
  createWindow();
  buildMenu();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ──────────────────────────────────────────────
// Menu nativo
// ──────────────────────────────────────────────
function buildMenu() {
  const template = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Recarregar',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow && mainWindow.reload(),
        },
        { type: 'separator' },
        {
          label: 'Sair',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+F4',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'Visualizar',
      submenu: [
        { role: 'resetZoom',  label: 'Zoom padrão' },
        { role: 'zoomIn',     label: 'Aumentar zoom' },
        { role: 'zoomOut',    label: 'Diminuir zoom' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Tela cheia' },
        {
          label: 'DevTools',
          accelerator: 'F12',
          click: () => mainWindow && mainWindow.webContents.toggleDevTools(),
        },
      ],
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Sobre o HidroSmart',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type:    'info',
              title:   'HidroSmart',
              message: 'HidroSmart v2.0',
              detail:  'Controle de consumo de água para condomínios.\n\nDesktop app powered by Electron.',
              buttons: ['OK'],
            });
          },
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
