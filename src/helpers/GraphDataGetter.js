import { FileManager } from "./FileManager";

export class GraphDataGetter {
    static async getGraph(fileName, format, defaultData) {
        let graphResult;
        let repeat = true;
        let repeatCounts = 0;
        while(repeat && repeatCounts < 5) {
            try {
            graphResult = await FileManager.getFile(fileName, format);
            if (graphResult) repeat = false;
        } catch (e) {
            throw e
        }
        
        if (!graphResult) {
            try {
                FileManager.write(fileName, defaultData, format);
                repeatCounts++
            } catch (e) {
                throw e;
            }
        }
        }
        if (!graphResult) {
            throw 'Ошибка при получении данных Graph';
        }
        return graphResult;
    }
}