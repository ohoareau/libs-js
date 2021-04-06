const app = require('express')()

app.get('/', (req, res) => {
    res.json({a: 'b'});
});

module.exports = app;