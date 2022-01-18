import mustache from "mustache/mustache.mjs";

/* 
  НЕЛЬЗЯ ВКЛАДЫВАТЬ В ОДИН КЛАСС БОЛЬШЕ ОДНОГО СТИЛЯ
  В элементах не должен быть прописан style='...
  В конце стиля должна стоять ;
  В стиле следует использовать одинарные кавычки (')
  Нельзя присваивать стиль для элемента не по классу, т.е => h1 {...}
  Класс .zone зарезервирован
  */
export class MustacheGenerator {
    constructor(elems, styles) {
        this.elems = elems;
        this.styles = styles;
        this.elKeys = Object.keys(this.elems);
        this.stylesKeys = Object.keys(this.styles);

        this.template = {};
        this.templateParts = {};
        this.styleWrap = {};
        this.classes = [];

        this.zones = [];

        //===========Temp
        this.tempStyleGroup = [];
        // Extracted data
        this.html = "";
        this.styleGroupName = "";
    }

    ///============ Prepare
    /**
     * Возвращает функции для обёртки контента при экспорте Mustache
     * @param {string} maxWidth - максимальная ширина контейнера => 100px
     * @returns {{ headTags, container, endTags }}
     */
    preGenerateTemplateParts(maxWidth) {
        function headTags(tagType) {
            switch (tagType) {
                case "open":
                    const html = "<html lang='en'>";
                    const head = `<head><meta charset='utf-8'><title>dragHTML</title>`;
                    const style = `<style type='text/css'>`;
                    return html + head + style;
                case "close":
                    const closeStyle = `</style>`;
                    const closeHead = "</head>";
                    return closeStyle + closeHead;
            }
        }
        function container(tagType) {
            switch (tagType) {
                case "open":
                    const body = `<body><div class='container' style='height: 100%; width: 100%; max-width: ${maxWidth}; margin: 0 auto; display: flex; flex-flow: column; align-items: flex-start; justify-content: flex-start;'>`;
                    return body;
                case "close":
                    const closeBody = "</div>" + "</body>";
                    return closeBody;
            }
        }
        function endTags(tagType) {
            if (tagType == "close") {
                const closeHtml = "</html>";
                return closeHtml;
            }
        }
        // return { html, closeHtml, head, style, closeStyle, closeHead, body, closeBody };
        return { headTags, container, endTags };
    }
    /**
     * Инициализация начальной разметки
     * @param {string} maxWidth - максимальная ширина контейнера => 100px
     */
    initMustache(maxWidth) {
        this.templateParts = this.preGenerateTemplateParts(maxWidth);
    }

    //============ Checkers
    /**
     * Возвращает результат проверки существования стиля элемента
     * @returns {boolean}
     */
    isStyleGroupExists() {
        let isExist = this.stylesKeys.some(
            (style) => style === this.styleGroupName
        );
        if (isExist) {
            return isExist;
        } else {
            throw new Error("Указанная группа стилей не найдена");
        }
    }
    /**
     * Возвращает результат проверки наличия класса в локальном списке классов
     * @param {*} className - имя класса
     * @returns {boolean}
     */
    isStyleExists(className) {
        return this.classes.some((style) => style.class == className);
    }
    /**
     * Возвращает результат проверки наличия свойства style у html тега.
     * @returns {boolean}
     */
    isStylePropExist() {
        let reg = this.getStyleRegExp("add");
        let result = this.html.search(reg);
        return result > -1;
    }
    /**
     * Возвращает результат проверки, является ли элемент зоной.
     * @param {object} elem - элемент
     * @param {string} elem.name - название элемента
     * @returns {boolean}
     */
    isElemTypeZone(elem) {
        try {
            return elem.name === "dropZone";
        } catch (e) {
            throw (
                new Error("Не удалось проверить тип добавляемого элемента. ") +
                e
            );
        }
    }
    /**
     * Возвращает результат проверки наличия элемента в существующем списке элементов
     * @param {string} elemName - название элемента
     * @returns {boolean}
     */
    isElemExists(elemName) {
        let isExist = this.elKeys.some((el) => el == elemName);
        if (!isExist) {
            throw new Error("Указанный элемент не существует");
        }
        return isExist;
    }

    //============ Getters

    /**
     * Возвращает объект элемента, найденный по названию элемента в существующем списке элементов
     * @param {string} elemName - название элемента
     * @returns {{html, style}}
     */
    getElemByName(elemName) {
        try {
            this.isElemExists(elemName);
        } catch (e) {
            throw new Error("Ошибка при получении элемента: ") + e;
        }
        return this.elems[elemName];
    }
    /**
     * Возвращает список классов для элемента по названию группы стилей
     * @returns {Array}
     */
    getStyleGroupByName() {
        let classes = [];

        try {
            this.isStyleGroupExists();
        } catch (e) {
            throw new Error("Ошибка при получении группы стилей") + e;
        }

        try {
            this.styles[this.styleGroupName].styleCode.forEach((prop) => {
                let existingClass = classes.find((c) => c === prop.class);
                if (!existingClass) {
                    classes.push({ class: prop.class, rules: prop.rules });
                } else {
                    existingClass.rules += prop.rules;
                }
            });
        } catch (e) {
            throw new Error("Ошибка при переборе стилей") + e;
        }
        return classes;
    }
    /**
     * Возвращает регулярное выражение для поиска style="... или ...>
     * @param {string} type - 'add' | 'insert'
     * @returns {RegExp}
     */
    getStyleRegExp(type) {
        if (type == "add") {
            return new RegExp("style=['\"]?w*['\"]?", "gm");
        } else if (type == "insert") {
            return new RegExp("[>]+", "gm");
        } else {
            throw new Error("Указанный тип не найден");
        }
    }
    /**
     * Возвращает index символа в html, найденный по регулярному выражению
     * @param {RegExp} regExp
     * @returns {Number}
     */
    getStylePastePos(regExp) {
        let index = this.html.search(regExp);
        if (index < 0) {
            throw new Error("Позиция для вставки не найдена");
        }
        return index;
    }

    

    /**
     * Возвращает зону из локального списка зон
     * @param {string} zoneId - номер зоны
     * @returns {object}
     */
    getZone(zoneId) {
        if (zoneId.search('zone') > -1) {
            throw new Error('Неверный формат передачи zoneId');
        }
        let zone;
        try {
            zone = this.zones.find((z) => z.id == zoneId);
        } catch (e) {
            throw new Error("Не удалось найти зону. ") + e;
        }
        return zone;
    }

    //============ Add

    /**
     * Добавляет в локальный список классов новые классы. Игнорирует повторы
     */
    pushNewStyles() {
        for (let styleItem of this.tempStyleGroup) {
            if (!this.isStyleExists(styleItem.class)) {
                this.classes.push(styleItem);
            }
        }
    }
    /**
     * Добавляет элемент в локальную зону
     * @param {string} zoneId - номер зоны
     * @param {string} elemId - id элемента
     */
    addElemToZone(zoneId, elemId) {
        let zone;
        try {
            zone = this.getZone(zoneId);
        } catch (e) {
            throw new Error("Ошибка при проверке списка зон: ") + e;
        }
        try {
            zone.items.push({ id: elemId, html: this.html });
        } catch (e) {
            throw new Error("Ошибка при добавлении элементов в зону: ") + e;
        }
    }

    //============ Change

    changeElem(zoneId, elem, style) {
        let zone;
        try {
            zone = this.getZone(zoneId);
        } catch (e) {
            throw new Error("Ошибка при проверке списка зон: ") + e;
        }
        // html и id. html ранее наполнялся стилями с коордлинатами и размерами из resizableContainer
        let mustacheElem = zone.items.find(item=>item.id === elem.id);
        this.html = elem.html;

        this.insertStyleProperties(style);

        mustacheElem.html = this.html;
    }

    removeMustache(zoneId, elemId) {
        let zone;
        try {
            zone = this.getZone(zoneId);
        } catch (e) {
            throw new Error("Ошибка при проверке списка зон: ") + e;
        }
        zone.items = zone.items.filter(item=>item.id !== elemId);
    }

    //============ Zone Push

    /**
     * Добавляет зону в локальный список зон
     */
    pushZoneToZones() {
        this.zones.push({
            id: this.zones.length + 1,
            zone: `<div id='zone${this.zones.length + 1}' class='zone'>`,
            closeZone: "</div>",
            items: [],
        });
    }
    /**
     * Добавляет класс зоны в список классов
     * @param {object} zone
     * @param {object} zone.height - высона зоны
     * @param {object} zone.y - координата
     */
    pushZoneClass(zone) {
        if (!this.isStyleExists(".zone")) {
            this.classes.push({
                class: ".zone",
                rules: `width: 100%; height: ${zone.height}px; position: relative; top: ${zone.y}px`,
            });
        }
    }

    //============ Wrappers

    /**
     * Возвращает html с обновленным свойством style
     * @param {Number} boundIndex
     * @param {String} styleStr
     * @returns {string}
     */
    wrapStylePaste(boundIndex, styleStr) {
        try {
            return (
                this.html.slice(0, boundIndex) +
                styleStr +
                this.html.slice(boundIndex)
            );
        } catch (e) {
            throw new Error("Не удалось обернуть стиль.");
        }
    }

    //============ String transform

    /**
     * Вставляет координаты и размеры элемента в его html код
     * @param {object} prop - объект значений
     * @param {object} prop.size - размеры
     * @param {number} prop.size.w - ширина
     * @param {number} prop.size.h - высота
     * @param {object} prop.pos - позиция
     * @param {number} prop.pos.x - координата
     * @param {number} prop.pos.y - координата
     */
    insertStyleProperties(prop) {
        const size = prop.size;
        const pos = prop.pos;
        let pasteStr = `width: ${size.w}px; height: ${size.h}px; position: absolute; top: ${pos.y}px; left: ${pos.x}px; `;
        try {
            if (this.isStylePropExist()) {
                const reg = this.getStyleRegExp("add");
                const index = this.getStylePastePos(reg);
                this.html = this.wrapStylePaste(index, pasteStr);
            } else {
                const reg = this.getStyleRegExp("insert");
                const index = this.getStylePastePos(reg);
                this.html = this.wrapStylePaste(index, ` style='${pasteStr}'`);
            }
        } catch (e) {
            throw new Error("Ошибка при вставке свойства: ") + e;
        }
    }

    //============ Actions

    /**
     * Извлекает данные из элемента на базе его имени, формируя html и styleGroupName
     * @param {object} elem - элемент
     * @param {string} elem.name - название элемента
     */
    extractElemData(elem) {
        try {
            ({ htmlCode: this.html, style: this.styleGroupName } =
                this.getElemByName(elem.name));
            this.tempStyleGroup = this.getStyleGroupByName();
        } catch (e) {
            throw e;
        }
    }

    /**
     * Очищает временные хранилища
     */
    clearTempData() {
        this.tempStyleGroup = [];
        this.html = "";
        this.styleGroupName = "";
    }

    //============ Main Func

    /**
     * Добавляет новый элемент для генерации mustache
     * @param {string} zoneId - номер зоны, в которой размещается элемент
     * @param {object} elem - название элемента
     * @param {string} elem.id - id элемента
     * @param {string} elem.name - название элемента
     * @param {object} elem.size - размеры
     * @param {number} elem.size.w - ширина
     * @param {number} elem.size.h - высота
     * @param {object} elem.pos - позиция
     * @param {number} elem.pos.x - координата
     * @param {number} elem.pos.y - координата
     */
    add(zoneId, elem) {
        try {
            this.extractElemData(elem);
        } catch (e) {
            throw e;
        }

        try {
            this.pushNewStyles();
        } catch (e) {
            throw new Error("Ошибка при добавлении новых стилей: ") + e;
        }

        try {
            this.insertStyleProperties({
                size: elem.size,
                pos: elem.pos,
            });
        } catch (e) {
            throw e;
        }

        try {
            this.addElemToZone(zoneId, elem.id);
        } catch (e) {
            throw (
                new Error("Ошибка при добавлении элементов в локальную зону") +
                e
            );
        }

        this.clearTempData();
    }

    /**
     * Регистрирует новую зону
     * @param {object} zone
     * @param {object} zone.height - высона зоны
     * @param {object} zone.y - координата
     */
    addZone(zone) {
        this.pushZoneToZones();
        this.pushZoneClass(zone);
    }

    //============ Export Mustache

    //=== Wrappers
    /**
     * Возвращает обёрнутое в объект значение
     * @param {string} key - ключ объекта
     * @param {*} value - значение
     * @returns {{ [key]: value }}
     */
    wrapToObj(key, value) {
        return { [key]: value };
    }
    /**
     * Возвращает массив объектов с контентом, находящися между открывающим и закрывающим тегом функции cupFunc
     * @param {function} cupFunc - функция для обёртки принимающая аргумент 'close' | 'open'
     * @param {Array} content - массив строк
     * @returns {Array}
     */
    async wrapContent(cupFunc, content) {
        let open = this.wrapToObj("tag", cupFunc("open"));
        let close = this.wrapToObj("tag", cupFunc("close"));
        let result = [];
        if (!!open) {
            result = [open];
        }

        if (!!content) {
            content.forEach((data) => result.push(this.wrapToObj("tag", data)));
        }

        if (!close) {
            throw new Error(
                "close не определён для закрытия контента. wrapContent"
            );
        }
        result.push(close);

        return result;
    }

    //=== Getters
    /**
     * Возвращает массив зон
     * @returns {Array}
     */
    async getZonesInArray() {
        let zones = [];
        try {
            for (let zone of this.zones) {
                let transformedZone = zone.zone;
                zone.items.forEach((child) => (transformedZone += child.html));
                transformedZone += zone.closeZone;
                zones.push(transformedZone);
            }
        } catch (e) {
            throw new Error("Не удалось сформировать массив зон. ") + e;
        }

        return zones;
    }
    /**
     * Возвращает массив классов
     * @returns {Array}
     */
    async getClassesInArray() {
        let classes = [];
        try {
            for (let classRule of this.classes) {
                classes.push(`${classRule.class} {${classRule.rules}} `);
            }
        } catch (e) {
            throw new Error("Не удалось сформировать массив классов. ") + e;
        }

        return classes;
    }

    //=== Main Func
    /**
     * Возвращает данные для наполнения шаблона Mustache.js
     * @returns
     */
    async getMustache() {
        let compiledTemplate = {
            headTags: [],

            container: [],

            endTags: [],
        };

        try {
            compiledTemplate.headTags = await this.wrapContent(
                this.templateParts.headTags,
                await this.getClassesInArray()
            );
        } catch (e) {
            throw new Error("Ошибка при получении headTags") + e;
        }

        try {
            compiledTemplate.container = await this.wrapContent(
                this.templateParts.container,
                await this.getZonesInArray()
            );
        } catch (e) {
            throw new Error("Ошибка при получении container") + e;
        }

        try {
            compiledTemplate.endTags.push(
                this.wrapToObj("tag", this.templateParts.endTags("close"))
            );
        } catch (e) {
            throw new Error("Ошибка при получении endTags") + e;
        }
        return compiledTemplate;
    }
}

/* mustache view
{
    "zones": [
        {
            "id": 1,
            "zone": "<div id='zone1' class='zone'>", //**** Тут должена быть уникализация класса или как-то инчае посмотреть как задавать высоту зонам
            "closeZone": "</div>", 
            "items": [
                "<div class='dragText'><span>Some text</span></div>",
                "<table class='dragTable'><thead><tr><th class='dragTable-test'></th><th class='dragTable-test'></th><th class='dragTable-test'>Тестовый текст</th><th class='dragTable-test'></th><th class='dragTable-test'></th></tr></thead><tbody><tr><td class='dragTable-test'></td><td class='dragTable-test'></td><td class='dragTable-test'></td><td class='dragTable-test'></td><td class='dragTable-test'>Не тестовый текст</td></tr></tbody></table>"
            ]
        }
    ],
    "classes": [
        {
            "class": ".dragText",
            "rules": "color: red;"
        }
    ],
    "template": { // Сделать итерацию, которая будет выводить элементы массива поочередно. В таком случае, можно будет оборачивать каждую строку в нужную разметку и не париться по поводу кросскода
        "html": "<html lang='en'>",
        "head": "<head><meta charset='utf-8'><title>dragHTML</title>",
        "style": "<style type='text/css'>", // Выводить до сюда, потом вставлять список стилей
        "closeStyle": "</style>", // После стилей продолжать от сюда
        "closeHead": "</head>",
        "body": "<body><div class='container' style='width: 100%; max-width: 574px; margin: 0 auto; display: flex; flex-flow: column; align-items: flex-start; justify-content: flex-start;'>", // Закончить здесь. Далее вывод зон и элементов.
        "closeBody": "</div></body>" // Закрыть двумя следующими
        "closeHtml": "</html>",
    }
}
*/
let viewJson = {
    // Template должен генерироваться по шаблону объекта здесь представленного, и наполняться в соответствии с выбранным языком(/разметки)
    headTags: [
        { tag: "<html lang='en'>" },
        { tag: "<head><meta charset='utf-8'><title>dragHTML</title>" },
        { tag: "<style type='text/css'>" },
        // Classes...
        { tag: "</style>" },
        { tag: "</head>" },
    ],

    container: [
        {
            tag: "<body><div class='container' style='width: 100%; max-width: 574px; margin: 0 auto; display: flex; flex-flow: column; align-items: flex-start; justify-content: flex-start;'>",
        },
        // zones...
        { tag: "</div></body>" },
    ],

    endTags: [{ tag: "</html>" }],
};

/* Mustache template
{{#headTags}}
{{{tag}}}
{{/headTags}}

{{#container}}
{{{tag}}}
{{/container}}

{{#endTags}}
{{{tag}}}
{{/endTags}}
*/
