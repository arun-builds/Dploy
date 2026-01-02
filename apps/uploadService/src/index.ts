import express from 'express';
import cors from 'cors';
import simpleGit from 'simple-git';
import { createId } from '../utils/cuid';
import { uploadFolderToS3 } from '../utils/uploadS3';
const app = express();
import { redis, initRedis } from "@repo/redis";
import { prisma } from '@repo/database';

app.use(cors());
app.use(express.json());

await initRedis();


app.post("/deploy", async (req, res) => {
    //TODO: Add middleware for the userId
    
    const { repoUrl, userId } = req.body;
    if (!repoUrl || !userId) res.json("Check the url and userId");
    const id = createId();
    if (!id) res.json("Internal Error")
    await simpleGit().clone(repoUrl, `./output/${id}`)
    await uploadFolderToS3(id);

    // TODO: Dual write problem here, we need to handle this better, also error handling overall
    await prisma.website.create({
        data: {
            domainId: id,
            userId: userId,
            status: "Uploaded"
        }
    });

    await redis.lPush("build-queue", id);
    res.json(id);
})


app.listen(8080, () => console.log("upload service starting"));