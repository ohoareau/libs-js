export const getFragment = (type: string, id: string) => ({
    type: 'template',
    template: `${__dirname}/../templates/${type}/${id.replace(/_/g, '/')}.md.ejs`,
});

export const recursiveGetTechnology = (id: string, context: any): any => {
    const t = require(`${__dirname}/../db/${id.replace(/_/g, '/')}.json`);
    t.id = id;
    t.name = t.name || t.id.replace(/_/g, ' ');
    t.path = id.replace(/_/g, '/');
    t.installProcedure && (t.installProcedure = {id, name: t.name, ...getFragment('install-procedures', id)});
    t.preRequisite && (t.preRequisite = {id, name: t.name, ...getFragment('pre-requisites', id)});
    t.dependencies = t.dependencies || [];
    t.fullDependencies = [...t.dependencies];
    t.installProcedures = t.installProcedure ? {
        [id]: t.installProcedure,
    } : {};
    t.preRequisites = t.preRequisite ? {
        [id]: t.preRequisite,
    } : {};
    t.requiredTechnologies = {};
    (t.dependencies).reduce((acc, d) => {
        const subT = context.fetched[d] || recursiveGetTechnology(d, context);
        acc.fullDependencies = acc.fullDependencies.concat(subT.fullDependencies);
        acc.installProcedures = {...acc.installProcedures, ...subT.installProcedures};
        acc.preRequisites = {...acc.preRequisites, ...subT.preRequisites};
        Object.assign(t.requiredTechnologies, subT.requiredTechnologies);
        t.requiredTechnologies[subT.id] = subT;
        return acc;
    }, t);
    t.fullDependencies = [...new Set(t.fullDependencies)];
    t.fullDependencies.sort();
    context.fetched[id] = t;
    return t;
}
export const sortAndDedupArray = (a: any[]) => {
    const b = [...new Set(a)];
    b.sort();
    return b;
};
export const requireTechnologies = (ids: string[]): any => {
    const context = {fetched: {}};
    const x = ids.map(id => recursiveGetTechnology(id, context));
    return {
        dependencies: sortAndDedupArray([
            ...ids,
            ...x.reduce((acc, y) => {acc = acc.concat((<any> y).fullDependencies || []); return acc;}, []),
        ]),
        technologies: {
            ...x.reduce((acc, y) => Object.assign(acc, {[(<any> y).id]: y}), {}),
            ...x.reduce((acc, y) => Object.assign(acc, (<any> y).requiredTechnologies || {}), {}),
        },
        preRequisites: {
            ...x.reduce((acc, y) => Object.assign(acc, (<any> y).preRequisites || {}), {}),
        },
        installProcedures: {
            ...x.reduce((acc, y) => Object.assign(acc, (<any> y).installProcedures || {}), {}),
        },
    }
}
export const getTechnology = (id: string): any => {
    return recursiveGetTechnology(id, {fetched: {}});
}
export default getTechnology