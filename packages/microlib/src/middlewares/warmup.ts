export default () => next => async action =>
    (action.request['event'] && action.request['event']['warm'])
        ? {...action, response: {...(action.response || {}), result: {status: 'success', code: 1000, message: 'warmed'}}}
        : next(action)
