import { detectContentType, getFileFromDeployment } from "@repo/aws-s3";
import express from "express";

const app = express();

app.get('{/*splat}', async (req, res) => {
    const host = req.hostname;

    const id = host.split(".")[0];



    if (!id) return res.status(400).send("Invalid domain");

    // if (id === "dploy" || host === "dploy.com") {
    //     return res.send("Welcome to Dploy! ");
    // }

    let filePath = req.path.slice(1);

    if (filePath === "") filePath = "index.html";

    const stream = await getFileFromDeployment(id, filePath);
    if (!stream) return res.status(404).send("Deployment not found");

    res.setHeader("Content-Type", detectContentType(filePath));
    stream.pipe(res);




    console.log(id)

});

app.listen(8000, () => console.log("Running on 8000"));

