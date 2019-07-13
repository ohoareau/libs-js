module.exports = function (w, d) {
    const c = {'.': {}};
    const widgets = {};
    const widgetGroups = {};
    const registered = false;
    const definitions = {};
    const register = function () {
        w.addEventListener('load', function () {

        });
    };
    const getCache = function () {
        return c;
    };
    const getWidgets = function () {
        return widgets;
    };
    const getWidgetGroups = function () {
        return widgetGroups;
    };
    const getWidgetGroup = function (group) {
        return widgetGroups[group] || [];
    };
    const registerWidgetDefinition = function (id, def) {
        def.id = widgets[id].config.id;
        definitions[id] = def;
    };
    const isActiveConfiguration = function (configuration, context) {
        const startTime = Date.parse(configuration.startTime);
        const endTime = Date.parse(configuration.endTime);
        if (!configuration.startTime && !configuration.endTime) {
            return false;
        }
        if (!configuration.startTime && configuration.endTime) {
            return context.now <= endTime;
        }
        if (configuration.startTime && !configuration.endTime) {
            return context.now >= startTime;
        }
        if (configuration.startTime && configuration.endTime) {
            return (context.now >= startTime) && (now <= endTime);
        }
        return false;
    };
    const selectActiveConfiguration = function (configurations, context) {
        if (!configurations || !configurations.length) {
            return undefined;
        }
        let defaultConfig = null;
        for (let i = 0, len = configurations.length; i < len; i++) {
            const configuration = configurations[i];
            if (isActiveConfiguration(configuration, context)) {
                return configuration;
            }
            if (!defaultConfig && configuration.default) {
                defaultConfig = configuration;
            }
        }

        return defaultConfig;
    };
    const parseConfiguration = function (c, callback) {
        console.log(c);
        callback(c);
    };
    const computeWidgetActiveConfiguration = function (id, context, callback) {
        let selected = undefined;
        if (definitions[id]) {
            selected = definitions[id].configurations
                ? selectActiveConfiguration(definitions[id].configurations, context)
                : definitions[id]
            ;
        }
        selected = selected || widgets[id].config;
        selected.id = widgets[id].config.id;
        parseConfiguration(selected, callback);
    };
    const renderWidget = function (id, context) {
        const widget = widgets[id];
        const ww = w;
        const dd = d;
        computeWidgetActiveConfiguration(id, context, function (selected) {
            const node = dd.getElementById(id);
            ww[widget.key].configure(selected, function (c) {
                ww[widget.key].render(node, c);
                widget.rendered = true;
            }, node);
        });
    };
    const createWidgetLoader = function (key, id, groups, api, parser, config) {
        const gg = [];
        for (let ii = 0; ii < groups.length; ii++) {
            if (',' === groups[ii]) {
                gg.push(groups.substr(0, ii));
                groups = groups.substr(ii + 1);
                ii = 0;
            }
        }
        if (groups.length) {
            gg.push(groups);
        }
        const widget = {loaded: false, key: key, id: id, groups: gg, config: config};
        widgets[id] = widget;
        for (let ii = 0; ii < gg.length; ii++) {
            (widgetGroups[gg[ii]] || (widgetGroups[gg[ii]] = [])).push(widget);
        }
        return function () {
            if (api) {
                const req = new XMLHttpRequest();
                req.onreadystatechange = function () {
                    if (req.readyState < 4) {
                        return;
                    }
                    registerWidgetDefinition(widget.id, JSON.parse(req.responseText));
                    widget.loaded = true;
                    renderWidget(widget.id, {now: Date.now()});
                };
                req.open('GET', api + '/' + config.id, true);
                req.send(null);
            } else {
                widget.loaded = true;
                renderWidget(widget.id, {now: Date.now()});
            }
        };
    };
    const attach = function (div, map = {}) {
        const groups = (div.dataset['xwg'] || '');
        if (map && map['main.js']) {
            const js = d.createElement('script');
            js.onload = createWidgetLoader(div.dataset.xwl || 'xwl', div.id, groups, div.dataset['xwa'], div.dataset['xwp'], {id: div.dataset['xwi']});
            js.src = div.dataset['xwu'] + '/' + map['main.js'];
            div.parentNode.insertBefore(js, div);
            if (map['main.css']) {
                const link = d.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.media = 'all';
                link.href = div.dataset['xwu'] + '/' + map['main.css'];
                div.parentNode.insertBefore(link, div);
            }
        } else {
            w.addEventListener('load', createWidgetLoader(div.dataset['xwl'] || 'xwl', div.id, groups, div.dataset['xwa'], div.dataset['xwp'], {id: div.dataset['xwi']}));
        }
    };
    const start = function () {
        if (!registered) {
            register();
        }
        const divs = d.getElementsByClassName('xw');
        const lists = {};
        const manifests = [];
        for (let i = 0; i < divs.length; i++) {
            const div = divs[i];
            if (div.id) {
                continue;
            }
            div.id = 'xw';
            for (let ii = 0; ii < 5; ii++) {
                div.id += String.fromCharCode(48 + Math.floor(Math.random() * 10));
            }
            const manifest = div.dataset['xwm'] || '.';
            lists[manifest] || ((lists[manifest] = []) && manifests.push(manifest));
            lists[manifest].push(div);
        }
        manifests.forEach(function (manifest) {
            let map = c[manifest];
            if (map) {
                for (let i = 0; i < lists[manifest].length; i++) {
                    attach(lists[manifest][i], map);
                }
            } else {
                const firstDiv = lists[manifest].shift();
                const req = new XMLHttpRequest();
                req.onreadystatechange = function () {
                    if (req.readyState < 4) {
                        return;
                    }
                    if (200 !== req.status) {
                        throw new Error('xw1');
                    }
                    map = JSON.parse(req.responseText);
                    c[manifest] = map.files;
                    attach(firstDiv, map);
                    for (let i = 0; i < lists[manifest].length; i++) {
                        attach(lists[manifest][i], map);
                    }
                };
                req.open('GET', manifest, true);
                req.send(null);
            }
        });
    };
    return {
        register,
        start,
        getWidgets,
        getWidgetGroup,
        getWidgetGroups,
        getCache,
    };
};