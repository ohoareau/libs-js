import * as actions from './actions';

export default {
    routes: [
        {name: 's3_pdf', uri: '/b:bucket<[a-z0-9]{2}>:name/*file.pdf', method: 'get', type: 'generate', params: {source: 's3'}},
        {name: 's3_pdf_static', uri: '/c:bucket<[a-z0-9]{2}>:name/*file.pdf', method: 'get', type: 'file', params: {source: 's3'}},
        {name: 'demo', uri: '/a/*file.pdf', method: 'get', type: 'generate', params: {source: 'demo'}},
        {name: 'root', uri: '/', method: 'get', type: 'root'},
    ],
    actions,
}