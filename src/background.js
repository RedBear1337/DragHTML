"use strict";

import { app, protocol, BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import * as electron from "electron";
import * as fs from "fs";

import { FileManager } from "@/helpers/FileManager";
import { MustacheGenerator } from "./helpers/MustacheGenerator";
import { GraphDataGetter } from "./helpers/GraphDataGetter";

const isDevelopment = process.env.NODE_ENV !== "production";

let win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } },
]);

electron.ipcMain.on("fileOperations", (event, arg) => {
    switch (arg.action) {
        case "write":
            try {
                FileManager.write(arg.fileName, arg.data, arg.format);
            } catch (e) {
                console.error("Ошибка во время записи файла: ", e);
                return;
            }
            break;
    }
});

electron.ipcMain.on("window", (event, arg) => {
    switch (arg.action) {
        case "close-win":
            win.destroy();
            break;
        case "hide-win":
            win.minimize();
            break;
    }
});

let elements;
let styles;
let m;

(async function (){
    try {
        elements = await GraphDataGetter.getGraph("elements", "json", "{}");
        styles = await GraphDataGetter.getGraph("styles", "json", "{}");
    } catch (e) {
        console.error('getGraph: ', e);
    }
    try {
        m = new MustacheGenerator(JSON.parse(elements), JSON.parse(styles));
    } catch (e) {
        console.error('Ошибка при создании класса: MustacheGenerato. ', e);
    }
})()

electron.ipcMain.handle("gett", async (event, arg) => {
    switch (arg.action) {
        case "getElementsList":
            let elements;
            try {
            elements = JSON.parse(elements);
            } catch (e) {
                console.error('Ошибка при получении файла элементов: ', e);
            }
            return elements
        case "getStylesList":
            let styles;
            try {
                 styles = JSON.parse(styles);
            } catch (e) {
                console.error('Ошибка при получении файла стилей: ', e);
            }
            return styles
        case "getMustache":
            let mustache;
            try {
                mustache = await m.getMustache();
            } catch (e) {
                console.error("Ошибка при получении mustache: ", e);
            }
            return JSON.stringify(mustache);
    }
});

async function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 802,
        height: 600,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol("app");
        // Load the index.html when not in development
        win.loadURL("app://./index.html");
    }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS);
        } catch (e) {
            console.error("Vue Devtools failed to install:", e.toString());
        }
    }
    createWindow();

    electron.ipcMain.on("service", async (event, arg) => {
        switch (arg.action) {
            case "initMustache":
                m.initMustache(arg.maxWidth);
                break;

            case "addMustache":
                try {
                    m.add(arg.zone, arg.elem);
                } catch (e) {
                    console.error(e);
                }

                break;
        }
    });
    
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === "win32") {
        process.on("message", (data) => {
            if (data === "graceful-exit") {
                app.quit();
            }
        });
    } else {
        process.on("SIGTERM", () => {
            app.quit();
        });
    }
}
