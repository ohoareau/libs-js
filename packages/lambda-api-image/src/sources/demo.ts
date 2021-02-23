export async function demo() {
    return {
        input: `file://${__dirname}/../../assets/demo.jpg`,
        options: {
            contentType: 'image/jpeg',
        },
    };
}