export default {
    id: 'standard',
    name: 'Standard',
    description: 'Standard',
    default: true,
    priority: 100,
    fonts: [
        {
            family: 'Open Sans',
            fonts: [
                { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
                { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-italic.ttf', fontStyle: 'italic' },
                { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 800 }
            ]
        },
    ],
    variables: {
        fontFamily1: 'Open Sans',
    },
}