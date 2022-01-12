import mustache from "mustache/mustache.mjs";

 /* 
  НЕЛЬЗЯ ВКЛАДЫВАТЬ В ОДИН КЛАСС БОЛЬШЕ ОДНОГО СТИЛЯ
  В элементах не должен быть прописан style='...
  В конце стиля должна стоять ;
  В стиле следует использовать одинарные кавычки (')
  */
export class MustacheGenerator {
    constructor(elems, styles) {
        this.elems = elems;
        this.styles = styles;
        this.elKeys = Object.keys(this.elems);
        this.stylesKeys = Object.keys(this.styles);

        this.template = {};
        this.styleWrap = {};
        this.classes = [];

        this.zones = [];
    }
    /**
     *
     * @param {*} maxWidth
     * @returns {{ html, endHtml, head, style, endStyle, endHead, body, endBody}}
     */
    preGenerateTemplate(maxWidth) {
        const html = "<html lang='en'>";
        const head = `<head><meta charset='utf-8'><title>dragHTML</title>`;
        const style = `<style type='text/css'>`;
        const endStyle = `</style>`;
        const endHead = "</head>";
        const body = `<body><div class='container' style='width: 100%; max-width: ${maxWidth}; margin: 0 auto; display: flex; flex-flow: column; align-items: flex-start; justify-content: flex-start;'>`;
        const endBody = "</div>" + "</body>";
        const endHtml = "</html>";
        return { html, endHtml, head, style, endStyle, endHead, body, endBody };
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
        for (let elem of elems) {
            let cycle = true;
            while (cycle) {
                try {
                    elem.class = elem.class.replace(".", "");
                } catch (e) {
                    throw e;
                }

                let insertedVar = `class=[/'"]${elem.class}[/'"]`;
                let reg = new RegExp(insertedVar, "g");
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
                let styles = style;
                try {
                    if (this.stylesKeys.some((s) => s === styles)) {
                        styles = this.getStyleByName(styles);
                    } else {
                        throw new Error("Указанный стиль не найден");
                    }
                } catch (e) {
                    console.error("Ошибка при получении стилей: ", e);
                }

                for (let styleClass of styles) {
                    if (
                        !this.classes.some(
                            (style) => style.class == styleClass.class
                        )
                    ) {
                        this.classes.push(styleClass);
                    }
                }

                let curZone = this.zones.find((z) => z.id == zone);
                curZone.items.push(htmlCode);
            } else {
                throw new Error("Элемент не найден в списке размещенных");
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
    async getClasses() {
        return this.classes;
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

{{{template.style}}}
{{#classes}}
{{class}}{ 
{{rules}} 
}
{{/classes}}
{{{template.endStyle}}}

{{{template.endHead}}}
{{{template.body}}}
    {{#zones}}
        {{{zone}}}
            {{{items}}}
        {{{endZone}}}
    {{/zones}}
{{{template.endBody}}}
{{{template.endHtml}}}
*/
/* mustache view
{
    "zones": [
        {
            "id": 1,
            "zone": "<div id='zone1' class='zone'>",
            "endZone": "</div>",
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
    "template": {
        "html": "<html lang='en'>",
        "endHtml": "</html>",
        "head": "<head><meta charset='utf-8'><title>dragHTML</title>",
        "style": "<style type='text/css'>",
        "endStyle": "</style>",
        "endHead": "</head>",
        "body": "<body><div class='container' style='width: 100%; max-width: 574px; margin: 0 auto; display: flex; flex-flow: column; align-items: flex-start; justify-content: flex-start;'>",
        "endBody": "</div></body>"
    }
}
*/
