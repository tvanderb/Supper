export interface Response {
    response: string;
    headers: Map<string, string>;
    data?: string;
}

export function responseToHttp(response: Response) {
    let headerstr = "";

    response.headers.forEach((value, key) => {
        headerstr = `${headerstr}${key}: ${value}\n`;
    });

    if (response.data) {
        return `HTTP/1.1 ${response.response}\n${headerstr}\n${response.data}`;
    } else {
        return `HTTP/1.1 ${response.response}\n${headerstr}\n`;
    }
}