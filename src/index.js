import http from "http";
import fs from "fs";
import path from "path";
import * as pdfReader from "./ai/pdf-reader.js";

const hostname = 'localhost';
const port = 8080;

const server =  http.createServer(async (req, res) => {
    if (req.method == 'GET') {
        let fileUrl;
        console.log(req.url);
        if (req.url == '/') fileUrl = 'index.html';
        else if(req.url.includes("Lab")){
            await pdfReader.writeRaport(`reports` + req.url, "web/res.html");
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            var filePath = path.resolve("./web/res.html");
            console.log(filePath);
            fs.createReadStream(filePath).pipe(res);
            return;
        }
        else fileUrl = req.url;

        var filePath = path.resolve('./web/' + fileUrl);
        const fileExt = path.extname(filePath);
        if (fileExt == '.html') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream(filePath).pipe(res);
        }
        else if (fileExt == '.css') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/css');
            fs.createReadStream(filePath).pipe(res);
        }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/javascript');
            fs.createReadStream(filePath).pipe(res);
        }
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});