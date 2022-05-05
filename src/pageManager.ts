import { readFileSync } from "fs";
import { Script } from "./scriptManager";

export function generatePage(file: string, scripts: Array<Script>): string {
    let page = "";

    try {
        page = readFileSync(file).toString();
    } catch (err) {
        console.error(err);
    }

    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        page = page.replace(`!s!{${script.name}}!s!`, script.function());
    }

    return page;
}