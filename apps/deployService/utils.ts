import { spawn } from "child_process";
import path from "path";
import fs from "node:fs/promises";
import { readdir, stat } from "node:fs/promises";
import { uplaodFIles } from "@repo/aws-s3";

export function buildProject(id: string) {
    return new Promise((resolve, reject) => {
        const projectPath = path.join(__dirname, `output/${id}`);

        const child = spawn("bun", ["install", "&&", "bun", "run", "build"], {
            cwd: projectPath,
            shell: true,
            stdio: "inherit" // direct logs to console
        });

        child.on("close", (code) => {
            console.log(`🏁 Build complete for ${id}`);
            resolve(code);
        });

        child.on("error", reject);
    });
}


export async function uploadDistToS3(id: string, bucket = "deployments") {
    const distPath = path.join(process.cwd(), `output/${id}/dist`);
    const files = await getAllFiles(distPath);

    await Promise.all(files.map(async ({ key, fullPath }) => {
        const body = await fs.readFile(fullPath);
        const s3Key = `dist/${id}/${key}`;

        await uplaodFIles(bucket, s3Key, body);
        console.log("s3key", s3Key);
    }));

    console.log(`Dist upload complete for ${id}`);
}




const IGNORE = ["node_modules", ".git", ".next", "dist", "build"];

export async function getAllFiles(distPath: string) {
    console.log("distpath", distPath);

    const items = await readdir(distPath, { recursive: true });

    const files: { key: string; fullPath: string }[] = [];

    for (const item of items) {
        if (IGNORE.some(f => item.includes(f))) continue;

        const fullPath = path.join(distPath, item);
        const fileStat = await stat(fullPath);

        if (!fileStat.isDirectory()) {
            files.push({ key: item, fullPath });
        }
    }

    return files;
}
