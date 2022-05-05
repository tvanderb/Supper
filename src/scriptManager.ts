import { readdirSync } from "fs";

export interface Script {
    name: string;
    function: Function;
}

export async function getScripts(location: string): Promise<Array<Script>> {
    let scripts: Array<Script> = new Array<Script>();

    const files = readdirSync(location);

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.endsWith(".sup.js")) {
            const script = await import(location + "/" + file);

            scripts.push({
                name: file.replace(".sup.js", ""),
                function: script.default
            });
        }
    }

    return scripts;
}