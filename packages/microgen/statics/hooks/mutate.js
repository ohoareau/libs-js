const buildMutator = ({type, config}) => (require('../utils/mutators')[type] || (() => x => x))(config);

module.exports = ({type, ...config}) => async data => buildMutator({type, config})(data);