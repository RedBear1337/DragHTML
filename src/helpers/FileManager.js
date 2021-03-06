import * as fs from "fs";

export class FileManager {
    /**
     * Возвращает результат проверки существования файла
     * @param {string} fileName - имя файла
     * @param {string} format - формат файла без точки
     * @returns {boolean | error}
     */
    static existingCheck(fileName, format) {
        let isExist;
        try {
            isExist = fs.existsSync(fileName+"."+format);
        } catch (e) {
            throw new Error('Ошибка во время проверки существования файла');
        }
        
        return isExist;
    }
    /**
     * 
     * @param {string} fileName - имя файла
     * @param {string} data 
     * @param {string} format - формат файла без точки
     * @returns 
     */
    static async write(fileName, data, format) {
        try {
            fs.writeFileSync(
                fileName+"."+format,
                data,
                "utf-8"
            );
        } catch (e) {
            console.error("Ошибка во время записи файла: ", e);
            return
        }
        try {
            if (!this.existingCheck(fileName, format)) {
                throw new Error('Не удалось записать файл');
            }
        } catch (e) {
            throw e;
        }
    }
    /**
     * Возвращает прочитанный файл
     * @param {string} fileName - имя файла
     * @param {string} format - формат файла без точки
     * @returns 
     */
    static async getFile(fileName, format) {
        try {
            if (!this.existingCheck(fileName, format)) return false;
        } catch (e) {
            throw e;
        }
        let file;
        try {
            file = fs.readFileSync(`${fileName}.${format}`, "utf-8");
        } catch (e) {
            throw (new Error('Ошибка во время чтения файла'), e)
        }
        
        return file;
    }
}