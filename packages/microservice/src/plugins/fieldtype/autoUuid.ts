import uuid from 'uuid/v4';

export default () => ({type: 'string', value: () => uuid()});