import * as actions from './actions';

export default {
    routes: [
        {name: 'dynamo', uri: '/d*path', method: 'get', type: 'redirect', params: {source: 'dynamodb'}, cache: 'public, max-age=60, s-max-age=60'},
        {name: 'short_s3', uri: '/c:bucket<[a-z0-9]{2}>*key', method: 'get', type: 'redirect', params: {source: 's3'}, cache: 'public, max-age=60, s-max-age=60'},
        {name: 's3', uri: '/b:bucket/*key', method: 'get', type: 'redirect', params: {source: 's3'}, cache: 'public, max-age=60, s-max-age=60'},
        {name: 'static', uri: '/a*path', method: 'get', type: 'redirect', params: {source: 'config'}, cache: 'public, max-age=60, s-max-age=60'},
        {name: 'root', uri: '/', method: 'get', type: 'root'},
        {name: 'catchall', type: 'notfound'},
    ],
    actions,
}