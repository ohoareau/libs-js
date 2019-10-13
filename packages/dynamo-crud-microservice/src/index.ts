import crud from '@ohoareau/dynamo-crud';

export default (definition): any => {
    const { get, find, update, remove, create } = crud(definition);
    const t = `${definition.type.substr(0, 1).toUpperCase()}${definition.type.substr(1)}`;
    const ts = `${t}s`;
    return {
        [`get${t}`]: ({ params: { id } }) => get(id),
        [`get${ts}`]: () => find(),
        [`update${t}`]: ({ params: { id, input } }) => update(id, input),
        [`delete${t}`]: ({ params: { id } }) => remove(id),
        [`create${t}`]: ({ params: { input } }) => create(input),
    };
};