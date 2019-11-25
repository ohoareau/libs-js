export default () => {
    const t = new Date().valueOf();
    return {type: 'number', value: () => t, updateValue: () => t};
}