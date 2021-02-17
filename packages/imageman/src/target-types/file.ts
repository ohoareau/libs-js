export async function file(img, {location}: any) {
    return img.toFile(location);
}