import { shell } from 'electron';
export declare const ipcRenderer: {
    send: (channel: string, ...args: any[]) => void;
    sendToHost: (channel: string, ...args: any[]) => void;
    sendTo: (webContentsId: number, channel: string, ...args: any[]) => void;
    sendSync: (channel: string, ...args: any[]) => any;
    invoke: (channel: string, ...args: any[]) => Promise<any>;
    on: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => Electron.IpcRenderer;
    off: (eventName: string | symbol, listener: (...args: any[]) => void) => Electron.IpcRenderer;
};
export { shell };
