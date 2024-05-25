import { jsPDF } from "jspdf";

class pdfDoc {
    constructor() {
        this.doc = new jsPDF();
    }

    #count = 15;
    addText(text) {
        this.doc.text(text, 10, this.#count, { lineHeightFactor: 1, maxWidth: 190 });
        this.#count += Math.ceil(this.doc.getTextWidth(text)/190)*5+15;
    }

    save(path) {
        this.doc.save(path);
    }
}