import sharp from 'sharp';
import fs from 'fs';

async function main(argv) {
    if (!argv[2]) throw new Error('Syntax: imageman <inputFile> <outputFile>');
    if (!argv[3]) throw new Error('Syntax: imageman <inputFile> <outputFile>');
    const inputFile = argv[2];
    const outputFile = argv[3];

    const roundedCorners = Buffer.from(
        fs.readFileSync(inputFile, 'utf8'));

    await sharp(roundedCorners)
        .png()
        .toFile(outputFile)
    ;
}

export default main