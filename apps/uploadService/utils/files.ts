import { readdir } from "node:fs/promises";
import path from "node:path";

export const getAllFiles = async (folderId: string) => {
    let response: string[] = [];
    const outputPath = path.resolve(import.meta.dir, `../output/${folderId}`)
    const files = await readdir(outputPath, { recursive: true });
    const fulll = files.map(file => path.join(outputPath, file));
    console.log(fulll);

}