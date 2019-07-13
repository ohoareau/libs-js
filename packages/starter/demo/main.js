window['xwl-1'] = {
    render: function (node, config) {
        node.innerHTML = `<h1>Widget #${config.id} : ${JSON.stringify(config)}</h1>`;
    },
    configure: function (c, callback) {
        callback(c);
    },
};