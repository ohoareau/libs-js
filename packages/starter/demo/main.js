window['xwl-1'] = function (node, config) {
    node.innerHTML = `<h1>Widget #${config.id} : ${JSON.stringify(config)}</h1>`;
};