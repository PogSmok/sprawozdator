import fs from 'fs';

export function createHtml(path, content) {
    fs.writeFile(path, "<html>\n" + content + "\n</html>", (err) => { if(err) console.log(err.msg) });
}