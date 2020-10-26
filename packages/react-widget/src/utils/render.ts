export const render = ({document, react, reactDOM, serviceWorker}) => async (id, App, props) => {
    reactDOM.render(
        react.StrictMode({children: App({...props, elementId: id})}),
        document.getElementById(id)
    );
    // or .register() to enabled PWA (https://bit.ly/CRA-PWA)
    serviceWorker && serviceWorker.unregister && await serviceWorker.unregister();
};

export default render