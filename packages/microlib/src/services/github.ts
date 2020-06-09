import fetch from 'node-fetch';

const checkStatusMiddleware = res => {
    if (!res.ok) throw new Error('Bad response status (not 2xx)');
    return res;
};

const jsonMiddleware = res => res.json();

const repositoryDispatch = async (org: string, repo: string, type: string, data: any = {}) => {
    return fetch(
        `https://api.github.com/repos/${org}/${repo}/dispatches`,
        {
            method: 'post',
            body: JSON.stringify({
                event_type: type,
                client_payload: data,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
        .then(checkStatusMiddleware)
        .then(jsonMiddleware)
    ;
}

export default {repositoryDispatch}

