import AWS from "aws-sdk";
import {Config} from "../..";

const cognito = new AWS.CognitoIdentityServiceProvider();

export default ({config: cfg}: {config: Config}) => async (ctx, {req: {id}}: {req: {id}}) => {
    const { Users: users } = await cognito.listUsers({
        UserPoolId: cfg.userPool, Filter: `sub = "${id}"`, Limit: 1,
    }).promise();
    if (!users || !users.length) throw new Error(`Unknown user '${id}'`);
    await cognito.adminDeleteUser({UserPoolId: cfg.userPool, Username: <string>users[0].Username}).promise();
};