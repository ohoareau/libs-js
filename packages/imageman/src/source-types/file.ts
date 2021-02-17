import fs from "fs";

export async function file({location}) {
    return Buffer.from(fs.readFileSync(location));
}