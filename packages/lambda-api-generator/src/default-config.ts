export default {
    routes: [
        {name: 'root', uri: '/', method: 'get', type: 'root'},
        {name: 'generate', uri: '/*file', type: 'generate'},
    ]
}