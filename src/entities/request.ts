export interface Request {
    method: string,
    path: string,
    headers: Map<string, string>,
    payload?: string;
}