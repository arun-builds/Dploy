import express from 'express';
import cors from 'cors';
import simpleGit from 'simple-git';
import { createId } from '../utils/cuid';
import { uploadFolderToS3 } from '../utils/uploadS3';
const app = express();
import { redis, initRedis } from "@repo/redis";

app.use(cors());
app.use(express.json());

await initRedis();


app.post("/deploy", async (req, res) => {
    const { repoUrl } = req.body;
    if (!repoUrl) res.json("Check the url");
    const id = createId();
    if (!id) res.json("Internal Error")
    await simpleGit().clone(repoUrl, `./output/${id}`)
    await uploadFolderToS3(id);
    await redis.lPush("build-queue", id);
    res.json(id);
})

console.log("Listening on 3000")

app.listen(3000);