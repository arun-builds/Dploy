import { downloadS3Folder } from "@repo/aws-s3";
import { redis, initRedis } from "@repo/redis";
import { buildProject, uploadDistToS3 } from "../utils";
import { prisma } from "@repo/database";

await initRedis()

while (1) {

    // TODO: Add error handling overall and cosnumer side dual write problem here too  and Idempotency
    const res = await redis.brPop('build-queue', 0);
    console.log(res);
    if (!res) continue;
    const id = res.element
    await downloadS3Folder("deployments", `output/${id}/`, `./output/${id}`);

    // TODO: containerize this build process
    await buildProject(id);

    await uploadDistToS3(id);
    await prisma.website.update({
        where: {
            domainId: id
        },
        data: {
            status: "Deployed"
        }
    })
    console.log("end of deployment")

}