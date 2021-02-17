export async function stdout(img) {
    console.log(await img.toBuffer());
}