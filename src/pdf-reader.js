import pdfUtil from "pdf-to-text";
import * as openai from "./openai.js";
import * as htmlwriter from "./html-writer.js";

class PdfData {
    //string
    theoreticalOverview;
    //array
    tasks;
} 


export async function writeRaport(pdfPath, raportPath) {
    pdfUtil.pdfToText(pdfPath, async function(err, data) { 
        if(err) return console.log(err.msg);
        let extractedData = new PdfData;
        data = data.replaceAll("\f                                             ĆWICZENIE 46\n", "");
        data = data.replaceAll("                                                                                  Drgania i Fale, Mechanika,\n", "");
        data = data.replaceAll(/\s\s/g, "");
        extractedData.theoreticalOverview = data.split("1. Opis teoretyczny do ćwiczenia")[1].split("2. Opis układu pomiarowego")[0];
        extractedData.tasks = data.split("2. Opis układu pomiarowego")[1]
                                    .split("6. Przykładowe pytania")[0]
                                        .split(/[1-9]\. /g)
        extractedData.tasks.forEach(task => task = task.split("\n\n")[0].trim());     

        let content = "";
        for(const task of extractedData.tasks) {
            content += "<div class='raport-p'>" + (await openai.createExplanation(task)) + "</div>";
            console.log(content);
        }
        htmlwriter.createHtml(raportPath, content);
    });
}