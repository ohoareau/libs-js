export const getWidgetConfiguration = async ({id}, fetcher) => ({id, ...await fetcher(id)});

export default getWidgetConfiguration