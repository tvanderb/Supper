import { Request } from './entities';

export function parseRequest(data: string): Request {
    let method: string = "";
    let path: string = "";
    let headers: Map<string, string> = new Map<string, string>();
    let payload = "";

    const lines = data.replace(/[\r]+/g, "").split("\n");
    let completedHeaders = false;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (i == 0) {
            const elements = line.split(" ");
            method = elements[0];
            path = elements[1];
        } else if (line == "" && !completedHeaders) {
            completedHeaders = true;
        } else if (line != "" && !completedHeaders) {
            const elements = line.split(":");
            headers.set(elements[0].toLowerCase(), elements[1]);
        } else if (line != "") {
            payload = payload + line;
        }
    }

    return {
        method: method,
        path: path,
        headers: headers,
        payload: payload
    };
}