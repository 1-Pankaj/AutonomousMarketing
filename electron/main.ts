import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

function getPreloadPath(): string {
  const candidates = [
    path.join(__dirname, 'preload.cjs'),
    path.join(__dirname, 'preload.js'),
    path.join(app.getAppPath(), 'electron', 'preload.cjs'),
    path.join(app.getAppPath(), 'dist-electron', 'preload.cjs'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return c;
    }
  }
  return path.join(__dirname, 'preload.cjs');
}

function createWindow() {
  const preloadPath = getPreloadPath();

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1280,
    minHeight: 800,
    backgroundColor: '#18191D',
    frame: false,
    resizable: true,
    maximizable: true,
    minimizable: true,
    ...(process.platform === 'darwin' ? { titleBarStyle: 'hidden' as const } : {}),
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send('window-maximized-state', true);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send('window-maximized-state', false);
  });

  const url = process.env.VITE_DEV_SERVER_URL;
  if (url) {
    mainWindow.loadURL(url);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Native Windows / OS Controls IPC
ipcMain.on('window-minimize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
  if (win && !win.isDestroyed()) {
    win.minimize();
  }
});

ipcMain.on('window-maximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
  if (win && !win.isDestroyed()) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }
});

ipcMain.on('window-close', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
  if (win && !win.isDestroyed()) {
    win.close();
  }
});

ipcMain.handle('window-is-maximized', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
  return win && !win.isDestroyed() ? win.isMaximized() : false;
});

// Local File System Storage IPC Handlers
function getLeadsDir(): string {
  const candidates = [
    path.join(app.getAppPath(), 'leads'),
    path.join(process.cwd(), 'leads'),
    path.join(__dirname, '../leads'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  const fallback = path.join(app.getAppPath(), 'leads');
  try {
    fs.mkdirSync(fallback, { recursive: true });
  } catch {}
  return fallback;
}

// 1. Leads
ipcMain.handle('get-leads', async () => {
  try {
    const leadsPath = path.join(getLeadsDir(), 'leads.json');
    if (fs.existsSync(leadsPath)) {
      const data = fs.readFileSync(leadsPath, 'utf-8');
      return JSON.parse(data);
    }
    // Fallback to sample template if private leads.json does not exist
    const examplePath = path.join(getLeadsDir(), 'leads.example.json');
    if (fs.existsSync(examplePath)) {
      const data = fs.readFileSync(examplePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading leads:', err);
  }
  return [];
});

ipcMain.handle('save-leads', async (_event, leads: any[]) => {
  try {
    const leadsPath = path.join(getLeadsDir(), 'leads.json');
    fs.writeFileSync(leadsPath, JSON.stringify(leads, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving leads.json:', err);
    return false;
  }
});

// 2. Posts & Queue
ipcMain.handle('get-posts', async () => {
  try {
    const postsPath = path.join(getLeadsDir(), 'posts.json');
    if (fs.existsSync(postsPath)) {
      const data = fs.readFileSync(postsPath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading posts.json:', err);
  }
  return null;
});

ipcMain.handle('save-posts', async (_event, posts: any[]) => {
  try {
    const postsPath = path.join(getLeadsDir(), 'posts.json');
    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving posts.json:', err);
    return false;
  }
});

// 3. Settings & Studio Preferences
ipcMain.handle('get-settings', async () => {
  try {
    const settingsPath = path.join(getLeadsDir(), 'settings.json');
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading settings.json:', err);
  }
  return null;
});

ipcMain.handle('save-settings', async (_event, settings: any) => {
  try {
    const settingsPath = path.join(getLeadsDir(), 'settings.json');
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving settings.json:', err);
    return false;
  }
});

// 4. Inbound Social Intents
ipcMain.handle('get-intents', async () => {
  try {
    const intentsPath = path.join(getLeadsDir(), 'intents.json');
    if (fs.existsSync(intentsPath)) {
      const data = fs.readFileSync(intentsPath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading intents.json:', err);
  }
  return null;
});

ipcMain.handle('save-intents', async (_event, intents: any[]) => {
  try {
    const intentsPath = path.join(getLeadsDir(), 'intents.json');
    fs.writeFileSync(intentsPath, JSON.stringify(intents, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving intents.json:', err);
    return false;
  }
});

// 5. Daily Sprint State
ipcMain.handle('get-sprint-state', async () => {
  try {
    const sprintPath = path.join(getLeadsDir(), 'sprint.json');
    if (fs.existsSync(sprintPath)) {
      const data = fs.readFileSync(sprintPath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading sprint.json:', err);
  }
  return null;
});

ipcMain.handle('save-sprint-state', async (_event, state: any) => {
  try {
    const sprintPath = path.join(getLeadsDir(), 'sprint.json');
    fs.writeFileSync(sprintPath, JSON.stringify(state, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving sprint.json:', err);
    return false;
  }
});

// 6. Export Leads CSV Backup
ipcMain.handle('export-leads-csv', async () => {
  try {
    const leadsPath = path.join(getLeadsDir(), 'leads.json');
    if (!fs.existsSync(leadsPath)) {
      return { success: false, error: 'leads.json not found' };
    }
    const raw = fs.readFileSync(leadsPath, 'utf-8');
    const leads = JSON.parse(raw);
    if (!Array.isArray(leads) || leads.length === 0) {
      return { success: false, error: 'No leads to export' };
    }

    const headers = Object.keys(leads[0]);
    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const csvLines = [
      headers.map(escapeCsv).join(','),
      ...leads.map(lead => headers.map(h => escapeCsv(lead[h])).join(','))
    ];

    const exportPath = path.join(getLeadsDir(), 'leads_backup.csv');
    fs.writeFileSync(exportPath, csvLines.join('\n'), 'utf-8');
    return { success: true, filePath: exportPath, count: leads.length };
  } catch (err: any) {
    console.error('Error exporting leads CSV:', err);
    return { success: false, error: err?.message || 'Export failed' };
  }
});
