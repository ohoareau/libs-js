import * as actions from './actions';

export default {
    routes: [
        {name: 's3', uri: '/b:bucket<[a-z0-9]{2}>:name/*file', method: 'get', type: 'generate', params: {source: 's3'}},
        {name: 'demo', uri: '/a/*file', method: 'get', type: 'generate', params: {source: 'demo'}},
        {name: 'root', uri: '/', method: 'get', type: 'root'},
    ],
    actions,
}