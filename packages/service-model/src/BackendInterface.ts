export default interface BackendInterface {
    update(id: string, changeSet: any, model: any, scopes: any): Promise<any>;
    load(id: string, ctx?: any): Promise<any>;
    save(id: string, data: any, ctx?: any): Promise<any>;
}