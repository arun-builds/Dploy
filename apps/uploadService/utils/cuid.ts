
import { init } from "@paralleldrive/cuid2";

export const createId = init({
    length: 5,
    fingerprint: process.env.INSTANCE_ID ?? "server",
});
