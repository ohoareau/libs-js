import PrismicJS from 'prismic-javascript/cjs/prismic-javascript';
import ResolvedApi, {QueryOptions} from "prismic-javascript/types/ResolvedApi";
import {RequestCallback} from "prismic-javascript/types/request";
import ApiSearchResponse from "prismic-javascript/types/ApiSearchResponse";

export class Prismic {
    private token: string;
    private repository: string;
    constructor({token, repository}: {token: string, repository: string}) {
        this.token = token;
        this.repository = repository;
    }
    setToken(token: string): void {
        this.token = token;
    }
    setRepository(repository: string): void {
        this.repository = repository;
    }
    getToken(): string {
        return this.token;
    }
    getRepository(): string {
        return this.repository;
    }
    async getApi(): Promise<ResolvedApi> {
        return PrismicJS.api(`http://${this.getRepository()}.prismic.io/api/v2`);
    }
    async query(q: string | string[], optionsOrCallback?: QueryOptions | RequestCallback<ApiSearchResponse>, cb?: RequestCallback<ApiSearchResponse>): Promise<ApiSearchResponse> {
        const api = await this.getApi();
        return api.query(q, optionsOrCallback, cb);
    }
    async getCollection(name: string): Promise<any> {
        const r = await this.query(
            PrismicJS.Predicates.at('document.type', name),
            { lang : '*' }
        );
        return r.results;
    }
    async getDocuments(): Promise<any> {
        const r = await this.query('', { lang : '*' });
        return r.results;
    }
    async getDocument(uid: string): Promise<any> {
        const r = await this.query(
            PrismicJS.Predicates.at('document.id', uid),
            { lang : '*' }
        );
        if (!r.results_size || !r.results.length) throw new Error(`Unknown document with uid '${uid}'`);
        return r.results[0];
    }
    async getDocumentsWithTags(tags: string[]): Promise<any> {
        const r = await this.query(
            PrismicJS.Predicates.at('document.tags', tags),
            { lang : '*' }
        );
        return r.results;
    }
    async getDocumentsWithTag(tag: string): Promise<any> {
        return this.getDocumentsWithTags([tag]);
    }
    async search(text: string): Promise<any> {
        const r = await this.query(
            PrismicJS.Predicates.fulltext('document', text),
            { lang : '*' }
        );
        return r.results;
    }
}

export const factory = ({token, repository}: {token?: string, repository: string}) => new Prismic({
    token: token || '',
    repository: repository,
});

export default factory