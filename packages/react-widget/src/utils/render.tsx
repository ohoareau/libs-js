export const render = ({document, React, ReactDOM = undefined}) => async (id, App, props) => {
    const StrictMode = (React || {}).StrictMode || (() => {});
    // noinspection TypeScriptValidateJSTypes
    ReactDOM && (await (ReactDOM as any).render(
        <StrictMode>
            <App {...props} elementId={id} />
        </StrictMode>,
        document.getElementById(id)
    ));
};

export default render