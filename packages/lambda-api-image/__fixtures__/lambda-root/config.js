module.exports = () => ({
    rules: [
        {name: 'r1', uri: /^\/(?<file>.*)$/, type: 'demo', cache: 'public, max-age=120, s-max-age=60'},
    ],
})