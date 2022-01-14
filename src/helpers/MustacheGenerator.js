import mustache from "mustache/mustache.mjs";

/* 
  НЕЛЬЗЯ ВКЛАДЫВАТЬ В ОДИН КЛАСС БОЛЬШЕ ОДНОГО СТИЛЯ
  В элементах не должен быть прописан style='...
  В конце стиля должна стоять ;
  В стиле следует использовать одинарные кавычки (')
  Нельзя присваивать стиль для элемента не по классу, т.е => h1 {...}
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

        // Temp
        this.tempStyleGroup = []
    }
    /**
     * Возвращает функции для обёртки контента
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
    /**
     * Возвращает список классов для элемента по названию группы стилей
     * @param {string} styleGroupName - название группы классов
     * @returns
     */
     getStyleGroupByName(styleGroupName) {
        let classes = [];

        try {
            this.isStyleExist(styleGroupName);
        } catch (e) {
            throw e;
        }

        try {
            console.log(this.styles[styleGroupName].styleCode);
            this.styles[styleGroupName].styleCode.forEach((prop) => {
                let existingClass = classes.find((c) => c === prop.class);
                if (!existingClass) {
                    classes.push({ class: prop.class, rules: prop.rules });
                } else {
                    existingClass.rules += prop.rules;
                }
            });
        } catch (e) {
            throw e;
        }
        return classes;
    }

    // transformClassToStyles(html, elems) {
    //     for (let elem of elems) {
    //         let cycle = true;
    //         while (cycle) {
    //             try {
    //                 elem.class = elem.class.replace(".", "");
    //             } catch (e) {
    //                 throw e;
    //             }

    //             let insertedVar = `class=[/'"]${elem.class}[/'"]`;
    //             let reg = new RegExp(insertedVar, "g");
    //             let find = html.search(reg);
    //             if (find > -1) {
    //                 html = html.replace(reg, `style='${elem.rules}'`);
    //             } else {
    //                 cycle = false;
    //             }
    //         }
    //     }
    //     return html;
    // }

    // Elem должен быть строкой - это один из импортируемого списка элементов.

    isStyleExist(styleName) {
        let isExist = this.stylesKeys.some((s) => s === styleName);
        if (isExist) {
            return isExist;
        } else {
            throw new Error("Указанный стиль не найден");
        }
    }

    clearTempData() {
        this.tempStyleGroup = [];
    }

    /**
     * Добавляет в массив класса новый элемент
     * @param {*} zone - номер зоны, в которой размещается элемент
     * @param {string} elem - название элемента
     */
    add(zone, elem) {
        if (elem !== "dropZone") {
            if (this.elKeys.some((el) => el == elem.name)) {
                let { htmlCode, style } = this.elems[elem.name];
                let styles = style;
                try {
                    this.tempStyleGroup = this.getStyleGroupByName(styles);
                } catch (e) {
                    console.error("Ошибка при получении стилей: ", e);
                }

                for (let styleClass of this.tempStyleGroup) {
                    if (
                        !this.classes.some(
                            (style) => style.class == styleClass.class
                        )
                    ) {
                        this.classes.push(styleClass);
                    }
                }

                function isStylePropExist(html) {
                    let reg = new RegExp("style=['\"]?w*['\"]?", "gm");
                    let result = html.search(reg);
                    return result > -1;
                }

                function addSizeToStyle(html, sizeObj) {
                    let reg = new RegExp("style=['\"]?w*['\"]?", "gm");
                    let addIndex = html.search(reg) + 7;
                    return (
                        html.slice(0, addIndex) +
                        `width: ${sizeObj.w}px; height: ${sizeObj.h}px; ` +
                        html.slice(addIndex)
                    );
                }

                function addPosToStyle(html, posObj) {
                    let reg = new RegExp("style=['\"]?w*['\"]?", "gm");
                    let addIndex = html.search(reg) + 7;
                    return (
                        html.slice(0, addIndex) +
                        `position: relative; top: ${posObj.y}px; left: ${posObj.x}px; ` +
                        html.slice(addIndex)
                    );
                }

                function insertSizeToStyle(html, sizeObj) {
                    let reg = new RegExp("[>]+", "gm");
                    let insertIndex = html.search(reg);
                    return (
                        html.slice(0, insertIndex) +
                        ` style='width: ${sizeObj.w}px; height: ${sizeObj.h}px;'` +
                        html.slice(insertIndex)
                    );
                }

                function insertPosToStyle(html, posObj) {
                    let reg = new RegExp("[>]+", "gm");
                    let insertIndex = html.search(reg);
                    // Мб не relative, можно попробовать присвоить контейнеру relative
                    return (
                        html.slice(0, insertIndex) +
                        ` style='position: relative; top: ${posObj.y}px; left: ${posObj.x}px;'` +
                        html.slice(insertIndex)
                    );
                }

                if (isStylePropExist(htmlCode)) {
                    htmlCode = addSizeToStyle(htmlCode, elem.size);
                } else {
                    htmlCode = insertSizeToStyle(htmlCode, elem.size);
                }
                if (isStylePropExist(htmlCode)) {
                    htmlCode = addPosToStyle(htmlCode, elem.pos);
                } else {
                    htmlCode = insertPosToStyle(htmlCode, elem.pos);
                }

                let curZone = this.zones.find((z) => z.id == zone);
                // curZone.items.push(htmlCode);
                curZone.items.push({ id: elem.id, html: htmlCode });
            } else {
                throw new Error("Элемент не найден в списке размещенных");
            }
        } else {
            this.zones.push({
                id: this.zones.length + 1,
                zone: `<div id='zone${this.zones.length + 1}' class='zone'>`,
                closeZone: "</div>",
                items: [],
            });

                if (!this.classes.some((style) => style.class == ".zone")) {
                    this.classes.push({
                        class: ".zone",
                        rules: `width: 100%; height: ${zone.height}px; position: relative; top: ${zone.y}px`,
                    }); //**** сделать такой же как с обычным элементом insert pos и size
                }
        }
        
        this.clearTempData();
    }
    /**
     * Возвращает обёрнутое в объект значение
     * @param {*} key - ключ объекта
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
    /**
     * Возвращает массив зон
     * @returns {Array}
     */
    async getZonesInArray() {
        let zones = [];
        for (let zone of this.zones) {
            let transformedZone = zone.zone;
            zone.items.forEach((child) => (transformedZone += child.html));
            transformedZone += zone.closeZone;
            zones.push(transformedZone);
        }
        return zones;
    }
    /**
     * Возвращает массив классов
     * @returns {Array}
     */
    async getClassesInArray() {
        let classes = [];
        for (let classRule of this.classes) {
            classes.push(`${classRule.class} {${classRule.rules}} `);
        }
        return classes;
    }
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

        compiledTemplate.headTags = await this.wrapContent(
            this.templateParts.headTags,
            await this.getClassesInArray()
        );

        compiledTemplate.container = await this.wrapContent(
            this.templateParts.container,
            await this.getZonesInArray()
        );

        compiledTemplate.endTags.push(
            this.wrapToObj("tag", this.templateParts.endTags("close"))
        );

        return compiledTemplate;
    }
}

/* mustache view
{
    "zones": [
        {
            "id": 1,
            "zone": "<div id='zone1' class='zone'>", // Тут должена быть уникализация класса или как-то инчае посмотреть как задавать высоту зонам
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
let template = {
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

/*
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
