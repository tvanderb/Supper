import { config as loadConfig } from 'dotenv';
import { existsSync, readFileSync, lstatSync } from 'fs';
import { createServer, Socket } from 'net';
import { Response, responseToHttp } from './entities';
import { generatePage } from './pageManager';
import { parseRequest } from './requestParser';
import { getScripts } from './scriptManager';

loadConfig();

(async () => {
    const server = createServer();
    const scripts = await getScripts(__dirname + "/../" + (process.env["SCRIPTS"] || "scripts"));
    const pagesFolder = __dirname + "/../" + (process.env["PAGES"] || "pages");

    server.on('connection', (socket: Socket) => {
        socket.on('data', (data: Buffer) => {
            const request = parseRequest(data.toString("utf-8"));

            let response: Response = {
                response: "404 Not Found",
                headers: new Map<string, string>([["Server", "Supper/0.1"]])
            };

            const resource = pagesFolder + request.path;

            if (existsSync(resource) && !lstatSync(resource).isDirectory()) {
                const content = readFileSync(resource).toString();

                if (content.startsWith("!l!LINK!l!")) {
                    const location = content.split("!l!link!l!")[1];

                    response.response = "301 Moved Permanently";
                    response.headers.set("Location", location);
                } else {
                    response.response = "200 OK";
                    
                    if (resource.endsWith(".html") || resource.endsWith(".htm")) {
                        response.headers.set("Content-Type", "text/html");
                        response.data = generatePage(resource, scripts);
                    } else {
                        response.data = readFileSync(resource).toString();
                    }
                }
            }

            if (request.path.endsWith("/")) {
                response.response = "301 Moved Permanently";
                response.headers.set("Location", request.path + "index.html");
            } 
    
            socket.write(responseToHttp(response));
            socket.destroy();
        });
    });

    server.listen(9000, '127.0.0.1');
})()

