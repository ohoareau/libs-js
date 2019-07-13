window['xwl-2'] = {
    render: function (node, config) {
        node.innerHTML = `<h1>Other Widget #${config.id}</h1>`;
    },
    configure: function (c, callback) {
        callback(c);
    },
};