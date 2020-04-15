import SpecsService from '@ohoareau/service-specs';
import {buildDefinition} from '@ohoareau/react-scope';

export default class ProjectService {
    private readonly specsService: SpecsService;
    private readonly client: any;
    private readonly getCurrentUserProjectQuery: any;
    constructor(client: any, specsService: SpecsService, getCurrentUserProjectQuery: any) {
        this.client = client;
        this.specsService = specsService;
        this.getCurrentUserProjectQuery = getCurrentUserProjectQuery;
    }
    async load(id: string, ctx: any): Promise<any> {
        return [
            this.progress(0, 'loading_project_query_subTitle', 'loading_project_title').bind(this),
            this.loadProject.bind(this),
            this.progress(40, 'loading_project_model_subTitle').bind(this),
            this.loadProjectModel.bind(this),
            this.progress(45, 'loading_project_definition_subTitle').bind(this),
            this.loadProjectDefinition.bind(this),
            this.progress(60, 'loading_project_specs_query_subTitle').bind(this),
            this.loadProjectSpecs.bind(this),
            this.progress(90, 'loading_project_specs_model_subTitle').bind(this),
            this.prepareComplete.bind(this),
            this.progress(100, 'loading_project_completed_title').bind(this),
        ]
            .reduce((p, c) => p.then(c), Promise.resolve(ctx)).then(x => {
                return x;
            })
        ;
    }
    progress(value, subTitle, title: string|undefined = undefined) {
        return async ({state, update}) =>
            update({loading: {...state.loading, progress: value, subTitle, ...(title ? {title} : {})}})
        ;
    }
    async prepareComplete({state, update}) {
        return update({completed: true, model: {...state.model}});
    }
    async loadProjectModel({state, update}) {
        const modules = (state.project.modules || {}).items || [];
        const moduleNames = modules.map(ii => ii.code || ii.name.toLowerCase().replace(/[^a-z0-9]+/ig, '_'));
        return update({model: {projects: [{...state.project}]}, modules, moduleNames});
    };
    async loadProjectDefinition({state, update}) {
        return update({definition: await buildDefinition([...state.moduleNames])})
    };
    async loadProjectSpecs({state, update}) {
        const specs = await this.specsService.load(state.id, {state});
        Object.assign(state.model.projects[0], specs.projects[0]);
        return update({specs: true, model: {...state.model}});
    };
    async loadProject({state, update}) {
        const {data} = await this.client.query({query: this.getCurrentUserProjectQuery, variables: {id: state.id}, options: {errorPolicy: 'all', fetchPolicy: 'cache-and-network'}});
        const project = data.getProject;
        return update({project, item: project})
    };
}