import {Map} from "../..";
import cognitoFactory from '../../factories/cognito';

const cognito = cognitoFactory();

export default cfg => async ({req: {payload: {data}}}: {req: {payload: {data: Map}}}) => {
    const attributes: Map = {email: data.email, email_verified: true};
    if (data.phone) {
        attributes.phone_number = data.phone;
        attributes.phone_number_verified = true;
    }
    const user = await cognito.createUser({userPool: cfg.userPool, username: data.email, attributes});
    data.id = user.id;
    const groups = cfg.group ? [cfg.group] : [];
    data.admin && cfg.adminGroup && groups.push(cfg.adminGroup);
    await cognito.addUserToGroupsByUsername({userPool: cfg.userPool, username: user.username, groups});
};