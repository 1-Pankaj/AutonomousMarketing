const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  onMaximizedState: (callback) => {
    const listener = (_event, isMaximized) => callback(isMaximized);
    ipcRenderer.on('window-maximized-state', listener);
    return () => ipcRenderer.removeListener('window-maximized-state', listener);
  },
  getLeads: () => ipcRenderer.invoke('get-leads'),
  saveLeads: (leads) => ipcRenderer.invoke('save-leads', leads),
  getPosts: () => ipcRenderer.invoke('get-posts'),
  savePosts: (posts) => ipcRenderer.invoke('save-posts', posts),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  getIntents: () => ipcRenderer.invoke('get-intents'),
  saveIntents: (intents) => ipcRenderer.invoke('save-intents', intents),
  getSprintState: () => ipcRenderer.invoke('get-sprint-state'),
  saveSprintState: (state) => ipcRenderer.invoke('save-sprint-state', state),
  exportLeadsCSV: () => ipcRenderer.invoke('export-leads-csv'),
});
