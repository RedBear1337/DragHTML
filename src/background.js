"use strict";

import { app, protocol, BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import * as electron from "electron";
import * as fs from "fs";

import { electronWindow } from "./helpers/electronWindow";
import { FileManager } from "@/helpers/FileManager";
import { MustacheGenerator } from "./helpers/MustacheGenerator";
import { GraphDataGetter } from "./helpers/GraphDataGetter";

const isDevelopment = process.env.NODE_ENV !== "production";

let windowObj = {};

let mmToPxRatio = 3.8;

let eWindow;

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

electron.ipcMain.on("window", async (event, arg) => {
    switch (arg.action) {
        case "close-win":
            windowObj["mainWindow"].destroy();
            break;
        case "hide-win":
            windowObj["mainWindow"].minimize();
            break;
        case "change-width-win":
            try {
                let transformedWidth = await eWindow.transformWidthFormat(
                    arg.width,
                    arg.unit
                );
                await eWindow.changeWindowBounds(windowObj[arg.winName], {
                    width: transformedWidth,
                });
            } catch (e) {
                console.error(`Ошибка при изменении окна - ${arg.winName}:`, e);
            }
            break;
    }
});

let elements;
let styles;
let m;

(async function () {
    try {
        elements = await GraphDataGetter.getGraph("elements", "json", "{}");
        styles = await GraphDataGetter.getGraph("styles", "json", "{}");
    } catch (e) {
        console.error("getGraph: ", e);
    }
    try {
        m = new MustacheGenerator(JSON.parse(elements), JSON.parse(styles));
    } catch (e) {
        console.error("Ошибка при создании класса: MustacheGenerator.", e);
    }
})();

try {
    eWindow = new electronWindow(mmToPxRatio);
} catch (e) {
    console.error("Ошибка при создании класса: electronWindow.", e);
}

electron.ipcMain.handle("gett", async (event, arg) => {
    switch (arg.action) {
        case "getElementsList":
            let elements;
            try {
                elements = JSON.parse(elements);
            } catch (e) {
                console.error("Ошибка при получении файла элементов:", e);
            }
            return elements;
        case "getStylesList":
            let styles;
            try {
                styles = JSON.parse(styles);
            } catch (e) {
                console.error("Ошибка при получении файла стилей:", e);
            }
            return styles;
        case "getMustache":
            let mustache;
            try {
                mustache = await m.getMustache();
            } catch (e) {
                console.error("Ошибка при генерации mustache: ", e);
            }
            return JSON.stringify(mustache);
    }
});

async function initElectron() {
    try {
        windowObj["mainWindow"] = await eWindow.createWindow();
    } catch (e) {
        throw new Error("Ошибка при создании окна: ") + e;
    }
    try {
        await eWindow.loadRequiredWindowType(windowObj["mainWindow"]);
    } catch (e) {
        throw new Error("Ошибка при загрузке страницы: ") + e;
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
    if (BrowserWindow.getAllWindows().length === 0) initElectron();
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
    await initElectron().catch((e) => console.error(e));

    electron.ipcMain.on("service", async (event, arg) => {
        switch (arg.action) {
            case "initMustache":
                m.initMustache(arg.maxWidth);
                break;

            case "addMustache":
                try {
                    if (m.isElemTypeZone(arg.elem)) {
                        m.addZone(arg.zone);
                    } else {
                        m.add(arg.zone, arg.elem);
                    }
                } catch (e) {
                    console.error("addMustache:", e);
                }

                break;
            case "changeMustache":
                try {
                    m.changeElem(arg.zone, arg.elem, arg.style);
                } catch (e) {
                    console.error("changeMustache:", e);
                }
                break;
            case "removeMustache":
                try {
                    m.removeMustache(arg.zone, arg.elem);
                } catch (e) {
                    console.error("removeMustache:", e);
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
