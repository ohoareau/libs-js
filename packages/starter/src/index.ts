export const uuid = ({w}) => {
    const crypto = w.crypto || w['msCrypto'] || { // crypto polyfill for IE11 or -
        getRandomValues: array => {
            for (let i = 0, l = array.length; i < l; i++) {
                array[i] = Math.floor(Math.random() * 256);
            }
            return array;
        }
    };
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    let uuid = '';
    for (let i = 0; i < array.length; i++) {
        uuid += array[i];
    }
    return uuid;
};
export const get = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        ((4 === xhr.readyState) && (200 === xhr.status)) && callback(xhr.responseText);
    };
    xhr.open('GET', url, true);
    xhr.send(null);
};
export const load = (response, {d, w, c}) => {
    let els = d.getElementsByClassName(c.p);
    if (!(els instanceof HTMLCollection)) els = [els];
    let map: any = {};
    for (let i = 0; i < els.length; i++) {
        if(els[i].className.indexOf(c.s) >= 0) continue; // already loaded
        map = map || JSON.parse(response) || {}; // lazy loading, first loop that need it, parse it
        if (map[c.j]) {
            const js = d.createElement('script');
            els[i].id = uuid({w});
            els[i].className += " " + c.s;
            ((js, fjs) => {
                if (js.readyState) {  // IE
                    js.onreadystatechange = () => {
                        if (('loaded' === js.readyState) || ('complete' === js.readyState)) {
                            js.onreadystatechange = null;
                            // noinspection JSUnresolvedFunction
                            w[c.p].registerWidget(fjs.id).then(() => {});
                        }
                    };
                } else {  // Others
                    js.onload = () => {
                        // noinspection JSUnresolvedFunction
                        w[c.p].registerWidget(fjs.id).then(() => {});
                    };
                }
            })(js, els[i]);
            js.src = c.u + '/' + map[c.j];
            els[i].parentNode.insertBefore(js, els[i]);
        }
        if (map[c.c]) {
            const l = d.createElement('link');
            l.rel = 'stylesheet';
            l.type = 'text/css';
            l.media = 'all';
            l.href = c.u + '/' + map[c.c];
            els[i].parentNode.insertBefore(l, els[i]);
        }
    }
};
export const starter = (d, w, c) => get(c.u + '/' + c.m, t => load(t, {d, w, c}));

export default starter;