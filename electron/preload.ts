import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  onMaximizedState: (callback: (isMaximized: boolean) => void) => {
    const listener = (_event: any, isMaximized: boolean) => callback(isMaximized);
    ipcRenderer.on('window-maximized-state', listener);
    return () => ipcRenderer.removeListener('window-maximized-state', listener);
  },
  getLeads: () => ipcRenderer.invoke('get-leads'),
  saveLeads: (leads: any[]) => ipcRenderer.invoke('save-leads', leads),
  getPosts: () => ipcRenderer.invoke('get-posts'),
  savePosts: (posts: any[]) => ipcRenderer.invoke('save-posts', posts),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: any) => ipcRenderer.invoke('save-settings', settings),
  getIntents: () => ipcRenderer.invoke('get-intents'),
  saveIntents: (intents: any[]) => ipcRenderer.invoke('save-intents', intents),
  getSprintState: () => ipcRenderer.invoke('get-sprint-state'),
  saveSprintState: (state: any) => ipcRenderer.invoke('save-sprint-state', state),
  exportLeadsCSV: () => ipcRenderer.invoke('export-leads-csv'),
});
