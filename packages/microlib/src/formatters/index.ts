export default {
    'application/json': res => res.body = JSON.stringify(res.body),
    'default': () => {},
}