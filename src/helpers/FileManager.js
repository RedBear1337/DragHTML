import * as fs from "fs";

export class FileManager {
    static existingCheck(fileName, format) {
        let isExist;
        try {
            isExist = fs.existsSync(fileName+"."+format);
        } catch (e) {
            throw new Error('Ошибка во время записи файла');
        }
        
        return isExist;
    }
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
            if (!this.existingCheck(fileName, format)) return;
        } catch (e) {
            throw e;
        }
    }
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