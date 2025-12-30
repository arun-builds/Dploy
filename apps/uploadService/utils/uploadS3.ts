import { s3, uplaodFIles } from "@repo/aws-s3";
import { getAllFiles } from "./files";
import fs from "node:fs/promises";
import mime from "mime-types";

export async function uploadFolderToS3(id: string, bucket = "deployments") {
    const files = await getAllFiles(id);

    for (const { key, fullPath } of files) {
        const body = await fs.readFile(fullPath);
        uplaodFIles(bucket, id, key, body)
    }

    console.log("s3 upload complete")
}