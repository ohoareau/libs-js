import axios from 'axios';

interface Identity {
    type: string;
    id?: string;
    name?: string;
    email?: string,
    firstName?: string,
    lastName?: string,
    role?: string;
    authenticated: boolean;
    providerType?: string;
    providerAppId?: string;
    providerUserId?: string;
}

export default class IdentityService {
    constructor() {
    }
    public async identifyFromEvent(event): Promise<Identity> {
        const {user = {}, headers = []} = event || {};
        return this.identify({accessToken: headers['x-access-token'], ...user})
    }
    public async identify(data): Promise<Identity> {
        if (this.isFederatedIdentity(data)) {
            return this.describeIdentityFromFederatedIdentity(data);
        }
        if (this.isAssumedRole(data)) {
            return this.describeIdentityFromAssumedRole(data);
        }
        return <Identity>{type: 'anonymous', id: 'anonymous', authenticated: false};
    }
    protected isFederatedIdentity({ cognitoIdentityId }): boolean {
        return !!cognitoIdentityId;
    }
    protected isAssumedRole(data): boolean {
        return data && data.userArn && /^arn:aws:sts::[0-9]+:assumed-role\//.test(data.userArn);
    }
    protected describeIdentityFromAssumedRole({ userArn }): Identity {
        return <Identity>{
            type: 'assumed-role',
            role: userArn,
            authenticated: false,
        }
    }
    protected async describeIdentityFromFederatedIdentity({ cognitoIdentityAuthProvider, cognitoIdentityAuthType, ...authInfos }): Promise<Identity> {
        const match = cognitoIdentityAuthProvider.match(/^\s*"\s*([^"]+)\s*"\s*,\s*"\s*([^"]+)\s*"$/);
        if (!match) {
            throw new Error(`Unable to extract infos from cognito identity auth provider`);
        }
        let infos = {};

        switch (match[1]) {
            case 'graph.facebook.com':
                infos = await this.extractFromFacebook(match[2], authInfos);
                break;
            case 'accounts.google.com':
                infos = await this.extractFromGoogle(match[2], authInfos);
                break;
            case 'www.amazon.com':
                infos = await this.extractFromAmazon(match[2], authInfos);
                break;
            default:
                const match2 = match[1].match(/^cognito-idp\.([^.]+)\.amazonaws\.com\/(.+)$/);
                if (!match2) {
                    throw new Error(`Unable to extract sub info from cognito identity auth provider #2`);
                }
                infos = await this.extractFromCognito(match[1], authInfos);
        }

        const data = <Identity>{
            id: authInfos.cognitoIdentityId,
            type: 'federated',
            authenticated: 'authenticated' === cognitoIdentityAuthType,
            ...infos,
        };

        return data;
    }
    protected async extractFromFacebook(raw: string, authInfos: object): Promise<object> {
        const data: any = await this.extractFromGeneric(raw, {providerType: 'facebook'}, authInfos);
        const response = await axios.get(`https://graph.facebook.com/${data.providerUserId}?fields=id,email,first_name,last_name,name&access_token=${data.accessToken}`);
        const {data: {first_name: firstName, last_name: lastName, email, id, name}} = response;
        return {...data, firstName, lastName, email, id, name};
    }
    protected async extractFromGoogle(raw: string, authInfos: object): Promise<object> {
        return this.extractFromGeneric(raw, {providerType: 'google'}, authInfos);
    }
    protected async extractFromAmazon(raw: string, authInfos: object): Promise<object> {
        return this.extractFromGeneric(raw, {providerType: 'amazon'}, authInfos);
    }
    protected async extractFromCognito(raw: string, authInfos: object): Promise<object> {
        return this.extractFromGeneric(raw, {providerType: 'cognito'}, authInfos);
    }
    protected async extractFromGeneric(raw: string, data: object, authInfos: object): Promise<object> {
        const [, providerAppId, providerUserId] = raw.split(/:/);

        return {
            accessToken: (<any>authInfos).accessToken,
            name: undefined,
            email: undefined,
            firstName: undefined,
            lastName: undefined,
            providerAppId,
            providerUserId,
            ...data,
        };
    }
}
