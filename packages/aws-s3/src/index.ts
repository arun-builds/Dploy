import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import mime from "mime-types";
import { Readable } from "stream";
import fs from "fs";
import path from "path";

export const s3 = new S3Client({
    region: "us-east-1",
    endpoint: "http://localhost:4566",
    credentials: {
        accessKeyId: "test",
        secretAccessKey: "test",
    },
    forcePathStyle: true // required for LocalStack/Minio/R2
});

export const uplaodFIles = async (bucket: string, key: string, body: Buffer) => {
    await s3.send(new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: mime.lookup(key) || "application/octet-stream"
    }));
}

export async function downloadS3Folder(bucket: string, prefix: string, localDir: string) {

    console.log(bucket, prefix, localDir);

    const { Contents } = await s3.send(new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
    }));

    if (!Contents || Contents.length === 0) {
        console.log("No files found");
        return;
    }

    // con be controlled using p-limits
    await Promise.all(
        Contents.map(async (item) => {
            if (!item.Key) return;

            const fileKey = item.Key;
            const localPath = path.join(localDir, fileKey.replace(prefix, ""));
            const folder = path.dirname(localPath);

            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, { recursive: true });
            }

            const obj = await s3.send(new GetObjectCommand({
                Bucket: bucket,
                Key: fileKey
            }));

            await streamToFile(obj.Body as Readable, localPath);
            console.log(` ${fileKey}`);
        })
    );
}


function streamToFile(stream: Readable, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const write = fs.createWriteStream(filePath);
        stream.pipe(write);
        write.on("finish", resolve);
        write.on("error", reject);
    });
}