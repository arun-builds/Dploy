import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const IGNORE = ["node_modules", ".git", ".next", "dist", "build"];

export async function getAllFiles(id: string) {
    const base = path.resolve(import.meta.dir, `../output/${id}`);
    const items = await readdir(base, { recursive: true });

    const files: { key: string; fullPath: string }[] = [];

    for (const item of items) {
        if (IGNORE.some(f => item.includes(f))) continue;

        const fullPath = path.join(base, item);
        const fileStat = await stat(fullPath);

        if (!fileStat.isDirectory()) {
            files.push({ key: item, fullPath });
        }
    }

    return files;
}
