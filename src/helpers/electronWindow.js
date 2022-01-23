import {BrowserWindow} from "electron";
import {createProtocol} from "vue-cli-plugin-electron-builder/lib";

export class electronWindow {
    constructor(mmToPxRatio) {
        this.pxFromMm = mmToPxRatio;
    }
    getWidthFromMm(digit) {
        return Math.round(digit*this.pxFromMm);
    }
    async transformWidthFormat(digit, format) {
        if (format == 'mm') {
            return await this.getWidthFromMm(digit);
        } else if (format == 'px') {
            return digit
        } else {
            throw new Error(`Указанный формат ширины (${format}) не поддерживается.`)
        }
    }
    async createWindow(size, options) {
        // Create default the browser window.
        let window = new BrowserWindow({
            width: 802,
            height: 600,
            frame: false,
            resizable: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });

        if (!!size) {
            try {
                window = await this.changeWindow(window, size);
            } catch (e) {
                throw 'size: ' + e;
            }
        }

        if (!!options) {
            try {
                window = await this.changeWindow(window, options);
            } catch (e) {
                throw 'options: ' + e;
            }
        }

        return window
    }

    async loadRequiredWindowType(window) {
        if (process.env.WEBPACK_DEV_SERVER_URL) {
            // Load the url of the dev server if in development mode
            await window.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
            if (!process.env.IS_TEST) window.webContents.openDevTools();
        } else {
            createProtocol("app");
            // Load the index.html when not in development
            window.loadURL("app://./index.html");
        }
    }

    async changeWindow(window, data) {
        let dataKeys = Object.keys(data);
        let windowKeys = Object.keys(window);

        let giveWarn = false;
        for (let key of dataKeys) {
            try {
                window[key] = data[key];
            } catch (e) {
                throw new Error(`Ошибка при переборе ключей data (key: ${key}): `) + e;
            }

            if (!windowKeys.some(k=>k==key)) {
                giveWarn = true;
                console.warn(`Ключ - ${key} не существовал у объекта window и был создан. Проверьте правильность заполнения`);
            }
        }
        if (giveWarn) {
            console.warn('Объект window:');
            console.warn(window);
        }
        return window;
    }
    /**
     * 
     * @param {*} window 
     * @param {object} bounds - { }
     */
    async changeWindowBounds(window, bounds) {
        window.setBounds(bounds);
    }
}