import BackendInterface from './BackendInterface';

export default class ModelService {
    private readonly localBackend: BackendInterface;
    private readonly remoteBackend: BackendInterface;
    constructor(localBackend: BackendInterface, remoteBackend: BackendInterface) {
        this.localBackend = localBackend;
        this.remoteBackend = remoteBackend;
    }
    async update(id, changeSet, model, scopes) {
        return Promise.all([this.localBackend, this.remoteBackend].map(async backend => backend.update(id, changeSet, model, scopes)));
    }
    async load(id, onChanged, ctx) {
        const cache = await this.localBackend.load(id, ctx);
        if (cache) {
            this.remoteBackend.load(id, ctx)
                .then(data => data ? this.localBackend.save(id, data, ctx) : undefined)
                .then(data => (data && onChanged) ? onChanged(data, {id}) : undefined)
            ;
            return cache;
        }
        return this.localBackend.save(id, await this.remoteBackend.load(id) || {}, ctx);
    }
}