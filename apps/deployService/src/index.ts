import { downloadS3Folder } from "@repo/aws-s3";
import { redis, initRedis } from "@repo/redis";
import { buildProject, uploadDistToS3 } from "../utils";

await initRedis()

while (1) {
    const res = await redis.brPop('build-queue', 0);
    console.log(res);
    if (!res) continue;
    const id = res.element
    await downloadS3Folder("deployments", `output/${id}/`, `./output/${id}`);

    // TODO: containerize this build process
    await buildProject(id);

    await uploadDistToS3(id);
    console.log("end of deployment")

}