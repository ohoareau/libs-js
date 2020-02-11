export default c => next => async action => {
    c = undefined;
    return (action.request['event'] && action.request['event']['warm'])
        ? {...action, response: {...(action.response || {}), result: {status: 'success', code: 1000, message: 'warmed'}}}
        : next(action);
}
