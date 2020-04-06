import ModelService, {LocalModelBackend, ApiClientModelBackend} from '..';

describe('ModelService', () => {
    it('', () => {
        new ModelService(
            new LocalModelBackend({}, 'myCachePrefix'),
            new ApiClientModelBackend(
                {
                    mutate: () => {},
                    query: () => {},
                },
                {},
                {}
            )
        );
    })
});