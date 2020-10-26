export const render = ({document, React, ReactDOM}) => async (id, Component, props) => {
    const StrictMode = (React || {}).StrictMode || (() => {});
    // noinspection TypeScriptValidateJSTypes
    ReactDOM && (await (ReactDOM as any).render(
        <StrictMode>
            <Component {...props} elementId={id} />
        </StrictMode>,
        document.getElementById(id)
    ));
};

export default render