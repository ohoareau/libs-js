export const uuid = ({w}) => {
    // crypto polyfill for IE11 or -
    const crypto = w.crypto || w['msCrypto'] || {
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
    let entrypoints: any = undefined;
    for (let i = 0; i < els.length; i++) {
        if(els[i].className.indexOf(c.s) >= 0) continue; // already loaded
        els[i].id = uuid({w});
        els[i].className += " " + c.s;
        entrypoints = entrypoints || ((JSON.parse(response) || {}).entrypoints || []); // lazy loading, first loop that need it, parse it
        entrypoints.reduce(async (acc, p) => {
            await acc;
            const js = d.createElement('script');
            return new Promise((resolve) => { // @todo handle reject
                ((js) => {
                    if (js.readyState) {  // IE
                        js.onreadystatechange = () => {
                            if (('loaded' === js.readyState) || ('complete' === js.readyState)) {
                                js.onreadystatechange = null;
                                resolve();
                            }
                        };
                    } else {  // Others
                        js.onload = () => {
                            resolve();
                        };
                    }
                })(js);
                js.src = c.u + '/' + p;
                els[i].parentNode.insertBefore(js, els[i]);
            });
        }, Promise.resolve()).then(() => {
            w[c.p].registerWidget(els[i]).then(() => {}).catch(e => {
                console.error('register error', e);
            })
        }).catch(e => {
            console.error('entrypoint error', e);
        })
    }
};
export const starter = (d, w, c) => get(c.u + '/' + c.m, t => load(t, {d, w, c}));

export default starter;