export default () => (e, req, res) => {
    res.send(
        (('object' === typeof e) && e.serialize)
            ? e.serialize()
            : {errorType: e.name || 'Error', message: e.message || 'Error', data: {}, errorInfo: {}}
    );
}