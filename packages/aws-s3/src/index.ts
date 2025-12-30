import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import mime from "mime-types";

export const s3 = new S3Client({
    region: "us-east-1",
    endpoint: "http://localhost:4566",
    credentials: {
        accessKeyId: "test",
        secretAccessKey: "test",
    },
    forcePathStyle: true // required for LocalStack/Minio/R2
});

export const uplaodFIles = async (bucket: string, id: string, key: string, body: Buffer) => {
    await s3.send(new PutObjectCommand({
        Bucket: bucket,
        Key: `${id}/${key}`,
        Body: body,
        ContentType: mime.lookup(key) || "application/octet-stream"
    }));
}