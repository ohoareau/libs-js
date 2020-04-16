export default {
    id: 'classic',
    name: 'Classique',
    description: 'Classique',
    priority: 10,
    fonts: [
        {
            family: 'Source Serif Pro',
            fonts: [
                { src: 'https://cdn.jsdelivr.net/npm/source-serif-pro@3.1.0/TTF/SourceSerifPro-Regular.ttf' },
                { src: 'https://cdn.jsdelivr.net/npm/source-serif-pro@3.1.0/TTF/SourceSerifPro-It.ttf', fontStyle: 'italic' },
                { src: 'https://cdn.jsdelivr.net/npm/source-serif-pro@3.1.0/TTF/SourceSerifPro-Bold.ttf', fontWeight: 800 }
            ]
        },
    ],
    variables: {
        fontFamily1: 'Source Serif Pro',
    },
}