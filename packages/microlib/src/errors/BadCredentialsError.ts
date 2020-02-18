export default class BadCredentialsError extends Error {
    public readonly username: string|undefined;
    constructor(username: string|undefined = undefined, message: string|undefined = undefined) {
        super(`Bad credentials${username ? ` for username '${username}'` : ''}${message ? ` (${message})` : ''}`);
        this.username = username;
    }
    serialize() {
        return {
            errorType: 'bad-credentials',
            message: this.message,
            data: {},
            errorInfo: {
                username: this.username,
            }
        }
    }
}