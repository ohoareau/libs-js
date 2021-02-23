import * as actions from './actions';

export default {
    routes: [
        {name: 'short_s3', uri: '/c:bucket<[a-z0-9]{2}>*key/*file', method: 'get', type: 'imageman', params: {source: 's3'}, cache: 'public, max-age=120, s-max-age=60'},
        {name: 's3', uri: '/b:bucket/*key/*file', method: 'get', type: 'imageman', params: {source: 's3'}, cache: 'public, max-age=120, s-max-age=60'},
        {name: 'demo', uri: '/a/*file', method: 'get', type: 'imageman', params: {source: 'demo'}, cache: 'public, max-age=120, s-max-age=60'},
        {name: 'root', uri: '/', method: 'get', type: 'root'},
        {name: 'catchall', type: 'notfound'},
    ],
    actions,
}