import * as actions from './actions';

export default {
    routes: [
        {name: 'webhook-event', uri: '/webhooks', method: ['post', 'put'], type: 'webhook'},
        {name: 'order-create', uri: '/orders', method: 'post', type: 'createOrder'},
        {name: 'order-get', uri: '/orders/:id', method: 'get', type: 'getOrder'},
        {name: 'root', uri: '/', method: 'get', type: 'root'},
        {name: 'catchall', type: 'notfound'},
    ],
    actions,
}