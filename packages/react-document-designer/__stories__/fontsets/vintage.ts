export default {
    id: 'vintage',
    name: 'Vintage',
    description: 'Vintage',
    priority: 20,
    fonts: [
        {
            family: 'Roboto',
            fonts: [
                { src: 'https://cdn.jsdelivr.net/npm/@typopro/web-roboto@3.7.5/TypoPRO-Roboto-Regular.ttf' },
                { src: 'https://cdn.jsdelivr.net/npm/@typopro/web-roboto@3.7.5/TypoPRO-Roboto-Italic.ttf', fontStyle: 'italic' },
                { src: 'https://cdn.jsdelivr.net/npm/@typopro/web-roboto@3.7.5/TypoPRO-Roboto-Bold.ttf', fontWeight: 800 }
            ]
        },
    ],
    variables: {
        fontFamily1: 'Roboto',
    },
}