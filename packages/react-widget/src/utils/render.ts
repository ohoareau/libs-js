export const render = ({document, React = undefined, ReactDOM = undefined}) => async (id, App, props) => {
    // noinspection TypeScriptValidateJSTypes
    ReactDOM && (await (ReactDOM as any).render(
        React ? (React as any).StrictMode({children: App({...props, elementId: id})}) : () => null,
        document.getElementById(id)
    ));
};

export default render