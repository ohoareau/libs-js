import Context from "./Context";
import RequiredVariableContextError from "./errors/RequiredVariableContextError";

export default class ContextMessageEnvelop {
    protected readonly ctx: Context;
    protected readonly execCtx: Context;
    protected readonly topicArn: string;
    protected readonly message: {[k: string]: any};
    protected readonly messageAttributes: {[k: string]: any};
    constructor(ctx: Context, execCtx: Context, extra: {[k: string]: any} = {}, attributes: {[k: string]: any} = {}) {
        this.ctx = ctx;
        this.execCtx = execCtx;
        this.prepare();
        this.topicArn = this.buildTopicArn();
        this.message = this.buildMessage(extra);
        this.messageAttributes = this.buildMessageAttributes(attributes);
    }
    public toValues() {
        return {
            TopicArn: this.topicArn,
            Message: this.message,
            MessageAttributes: this.messageAttributes,
        }
    }
    public toJson() {
        return {
            TopicArn: this.topicArn,
            Message: JSON.stringify(this.message),
            MessageAttributes: this.messageAttributes,
        };
    }
    protected prepare() {
    }
    protected buildTopicArn(): string {
        const vars = this.ctx.get('vars', {});
        const tries = [
            this.formatTopicEnvVarName(`${this.execCtx.get('service')}_${this.execCtx.get('operation')}`),
            this.formatTopicEnvVarName(`${this.execCtx.get('service')}`),
            this.formatTopicEnvVarName('fallback'),
        ];
        if (vars) {
            const found = tries.find(t => !!vars[t]);
            if (found) {
                return vars[found];
            }
        }
        throw new RequiredVariableContextError(tries, this.ctx);
    }
    protected formatTopicEnvVarName(topic) {
        return `SNS_TOPIC_${topic.replace(/[^a-z0-9]+/gi, '_').toUpperCase()}_EVENTS_ARN`;
    }
    protected buildMessage(extra: {[k: string]: any}): {[k: string]: any} {
        const o = {...extra};
        const id = this.ctx.get('id');
        const od = this.ctx.get('old');
        const dd = this.ctx.get('data');
        const caller = this.ctx.get('caller');
        if (id) {
            Object.assign(o, {id});
        }
        if (od) {
            Object.assign(o, od);
        }
        if (dd) {
            Object.assign(o, dd);
        }
        if (caller) {
            Object.assign(o, {caller});
        }
        return o;
    }
    protected buildMessageAttributes(extra: {[k: string]: any}): {[k: string]: any} {
        const attrs = {...extra};

        attrs['service'] = this.execCtx.get('service');
        attrs['operation'] = this.execCtx.get('operation');
        attrs['tenant'] = this.ctx.get('tenant');
        attrs['country'] = this.ctx.get('country');

        return Object.keys(attrs).reduce((acc, k) => {
            const v = this.marshallAttributeValue(attrs[k]);
            if (v) {
                acc[k] = v;
            }
            return acc;
        }, {});
    }
    protected marshallAttributeValue(v): {[k: string]: any}|undefined {
        if ('string' === typeof v) {
            return {DataType: 'String', StringValue: v};
        }
        return undefined;
    }
}