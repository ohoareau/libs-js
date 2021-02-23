import * as actions from './actions';

export default {
    routes: [
        {name: 'event', uri: '/', method: 'post', type: 'event'},
        {name: 'root', uri: '/', method: 'get', type: 'root'},
        {name: 'catchall', uri: '/*file', type: 'notfound'},
    ],
    actions,
}