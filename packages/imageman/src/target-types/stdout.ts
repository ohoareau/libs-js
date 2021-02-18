export async function stdout(img) {
    process.stdout.write(await img.toBuffer());
}