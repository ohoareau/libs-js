export default [
    {name: 'webhooks', uri: /^\/webhooks[\/]?$/, type: 'webhook', cache: 'no-cache'},
    {name: 'catchall', uri: /^\/(?<file>.*)$/, type: 'empty', cache: 'no-cache'},
]