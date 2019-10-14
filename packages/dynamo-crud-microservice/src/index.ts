import crud from '@ohoareau/dynamo-crud';

export default (definition): any => {
    const crudService = crud(definition);
    const { get, find, update, remove, create } = crudService;
    const t = `${definition.type.substr(0, 1).toUpperCase()}${definition.type.substr(1)}`;
    const st = `${definition.type.substr(0, 1).toLowerCase()}${definition.type.substr(1)}`;
    const ts = `${t}s`;
    return {
        [`get${t}`]: ({ params: { id } }) => get(id),
        [`get${ts}`]: () => find(),
        [`update${t}`]: ({ params: { id, input } }) => update(id, input),
        [`delete${t}`]: ({ params: { id } }) => remove(id),
        [`create${t}`]: ({ params: { input } }) => create(input),
        [`${st}Service`]: crudService,
    };
};