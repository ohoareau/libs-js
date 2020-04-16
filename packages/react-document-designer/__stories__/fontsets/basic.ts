export default {
    id: 'basic',
    name: 'Basic',
    description: 'Basic',
    priority: 5,
    fonts: [
        {
            family: 'Iosevka',
            fonts: [
                { src: 'https://cdn.jsdelivr.net/npm/@typopro/web-iosevka@3.7.5/TypoPRO-iosevka-term-regular.ttf' },
                { src: 'https://cdn.jsdelivr.net/npm/@typopro/web-iosevka@3.7.5/TypoPRO-iosevka-term-italic.ttf', fontStyle: 'italic' },
                { src: 'https://cdn.jsdelivr.net/npm/@typopro/web-iosevka@3.7.5/TypoPRO-iosevka-term-bold.ttf', fontWeight: 800 }
            ]
        },
    ],
    variables: {
        fontFamily1: 'Iosevka',
    },
}