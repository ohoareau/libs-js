(function(date, d, l, c) {
    const divs = d.getElementsByClassName('xw');
    const lists = {};
    const manifests = [];
    const f = function (manifest, div, map) {
        if (map['main.js']) {
            const js = d.createElement('script');
            js.onload = l(div.dataset.xwl || 'xwl', div.id, {manifest, id: div.dataset.xwi, api: div.dataset.xwa, date});
            js.src = div.dataset.xwu + '/' + map['main.js'];
            div.parentNode.insertBefore(js, div);
            if (map['main.css']) {
                const link = d.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.media = 'all';
                link.href = div.dataset.xwu + '/' + map['main.css'];
                div.parentNode.insertBefore(link, div);
            }
        } else {
            l(div.dataset.xwl || 'xwl', div.id, {manifest, id: div.dataset.xwi, api: div.dataset.xwa, date})();
        }
    };

    for (let i = 0; i < divs.length; i++) {
        const div = divs[i];
        if (div.id) {
            continue;
        }
        div.id = 'xw';
        for (let ii = 0; ii < 5; ii++) {
            div.id += String.fromCharCode(48 + Math.floor(Math.random() * 10));
        }
        const manifest = div.dataset.xwm;
        lists[manifest] || ((lists[manifest] = []) && manifests.push(manifest));
        lists[manifest].push(div);
    }
    manifests.forEach(function (manifest) {
        let map = c.get(manifest);
        if (map) {
            for (let i = 0; i < lists[manifest].length; i++) {
                f(manifest, lists[manifest][i], map);
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
                c.set(manifest, map);
                f(manifest, firstDiv, map);
                for (let i = 0; i < lists[manifest].length; i++) {
                    f(manifest, lists[manifest][i], map);
                }
            };
            req.open('GET', manifest, true);
            req.send(null);
        }
    });
})(new Date(), document, function (l, a, b) {
    return function () {
        window[l](a, b);
    };
}, {
    set: function (k, v) {
        window['xwc'] || (window['xwc'] = {});
        window['xwc'][k] = v;
    },
    get: function (k, d = undefined) {
        return (window['xwc'] && window['xwc'][k]) ? window['xwc'][k] : d;
    }
});