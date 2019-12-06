import cognitoFactory from '../../factories/cognito';

const cognito = cognitoFactory();

export default cfg => async ({req: {payload: {id}}}: {req: {payload: {id}}}) =>
    cognito.deleteUser({userPool: cfg.userPool, id})
;