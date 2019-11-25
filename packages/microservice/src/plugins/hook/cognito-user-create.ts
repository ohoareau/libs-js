import AWS from "aws-sdk";
import {Map} from "../..";

const cognito = new AWS.CognitoIdentityServiceProvider();

export default cfg => async ({req: {payload: {data}}}: {req: {payload: {data: Map}}}) => {
    const userAttributes = [{Name: 'email', Value: data.email}, {Name: 'email_verified', Value: 'True'}];
    if (data.phone) {
        userAttributes.push({Name: 'phone_number', Value: data.phone});
        userAttributes.push({Name: 'phone_number_verified', Value: 'True'});
    }
    const cognitoResponse = await cognito.adminCreateUser({
        UserPoolId: cfg.userPool,
        Username: data.email,
        DesiredDeliveryMediums: ['EMAIL'],
        ForceAliasCreation: false,
        UserAttributes: userAttributes,
    }).promise();
    data.id = (<any>cognitoResponse).User.Attributes.find(a => a.Name === 'sub').Value;
    const groups = cfg.group ? [cfg.group] : [];
    data.admin && cfg.adminGroup && groups.push(cfg.adminGroup);
    await Promise.all(groups.map(g => cognito.adminAddUserToGroup({
        GroupName: g,
        UserPoolId: cfg.userPool,
        Username: (<any>cognitoResponse).User.Username,
    }).promise()));
};