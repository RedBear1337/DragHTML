import mustache from "mustache/mustache.mjs";

export class MustacheGenerator {
    constructor(elems, styles) {
        this.elems = elems;
        this.styles = styles;
        this.elKeys = Object.keys(this.elems);
        this.stylesKeys = Object.keys(this.styles);

        this.template = {};

        this.zones = [];
    }
    /**
     *
     * @param {*} maxWidth
     * @returns {{ html, endHtml, head, endHead, body, endBody}}
     */
    preGenerateTemplate(maxWidth) {
        const html = "<html lang='en'>";
        const head =
            `<head><meta charset='utf-8'><title>dragHTML</title>`;
        const endHead = "</head>";
        const body =
            `<body><div class='container' style='width: 100%; max-width: ${maxWidth}; margin: 0 auto; display: flex; flex-flow: column; align-items: flex-start; justify-content: flex-start;'>`;
        const endBody = "</div>" + "</body>";
        const endHtml = "</html>";
        return {html,
            endHtml,
            head,
            endHead,
            body,
            endBody}
        ;
    }
    initMustache(maxWidth) {
        this.template = this.preGenerateTemplate(maxWidth);
    }
    getStyleByName(style) {
        // Классы из стринги надо бить на массивы
        let classes = [];
        try {
            console.log(this.styles[style].styleCode);
            this.styles[style].styleCode.forEach((prop) => {
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
    transformClassToStyles(html, elems) {
        // Перебираем список классов. Формируем полные стили. Проще всего просто заменять class на style и наполнять его полными стилями.
        // **** ДОБАВИТЬ ПРАВИЛО ВЁРСТКИ - НЕЛЬЗЯ ВКЛАДЫВАТЬ В ОДИН КЛАСС БОЛЬШЕ ОДНОГО СТИЛЯ, ИНАЧЕ СТАНОВИТСЯ ТЯЖЕЛО ОПРЕДЕЛИТЬ КУДА КАКОЙ СТИЛЬ ОПРЕДЕЛЯЕТСЯ ПРИ ФОРМИРОВАНИИ MUSTACHE
        // В элементах не должен быть прописан style='...
        // В конце стиля доожна стоять ;
        for (let elem of elems) {
            let cycle = true;
            while (cycle) {
                try {
                    elem.class = elem.class.replace('.', '');
                } catch (e) {
                    throw e
                }

                let insertedVar = `class=[/'"]${elem.class}[/'"]`;
                let reg = new RegExp(insertedVar, 'g');
                let find = html.search(reg);
                if (find > -1) {
                    html = html.replace(reg, `style='${elem.rules}'`);
                } else {
                    cycle = false;
                }
            }
        }
        return html;
    }
    // Elem должен быть строкой - это один из импортируемого списка элементов.
    add(zone, elem) {
        if (elem !== "dropZone") {
            if (this.elKeys.some((el) => el == elem)) {
                let { htmlCode, style } = this.elems[elem];
                try {
                    if (this.stylesKeys.some((s) => s === style)) {
                        style = this.getStyleByName(style);
                    } else {
                        throw new Error("Указанный стиль не найден");
                    }
                } catch (e) {
                    console.error("Ошибка при получении стилей: ", e);
                }
                try {
                    htmlCode = this.transformClassToStyles(htmlCode, style);
                } catch (e) {
                    console.error(e);
                    throw new Error("Ошибка при преобразовании классов");
                }

                let curZone = this.zones.find((z) => z.id == zone);
                curZone.items.push(htmlCode);
            } else {
                throw new Error('Элемент не найден в списке размещенных');
            }
        } else {
            this.zones.push({
                id: this.zones.length + 1,
                zone: `<div id='zone${this.zones.length + 1}' class='zone'>`,
                endZone: "</div>",
                items: [],
            });
        }
    }
    async getZones() {
       return this.zones; 
    }
    async getTemplate() {
        return this.template;
    }
}

let wrappers = {
    dropZone: function (text, render) {
        return `<div style="{{dropZone}}">` + render(text) + "</div>";
    },
    div: function (text, render) {
        return `<div style="{{div}}">` + render(text) + "</div>";
    },
    span: function (text, render) {
        return `<span style="{{span}}">` + render(text) + "</span>";
    },
};

/* mustache scheme
{{{template.html}}}
{{{template.head}}}
{{{template.body}}}
    {{#zones}}
        {{{zone}}}
            {{{items}}}
        {{{endZone}}}
    {{/zones}}
{{{template.endBody}}}
{{{template.endHead}}}
{{{template.endHtml}}}
*/
/* mustache view
"zones": [
        {
            "zone": "<div id='zone1' class='zone'>", "endZone": "</div>", 
                "items": [
                "<div id='1' class='dragText'><span>Some text</span></div>", 
                "2", 
                "<div id='2' class='dragText'><span>Some text</span></div>"
                ]
        },
        {
            "zone": "<div class='zone'></div>", "items": ["6", "5", "6"]
        }
]
*/