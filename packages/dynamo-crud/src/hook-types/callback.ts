export default callback => (callback instanceof Function)
    ? callback
    : () => {
        throw new Error(`Malformed hook callback (not a function)`);
    }
;