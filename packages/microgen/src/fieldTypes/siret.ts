export default () => ({type: 'string', validators: [{type: '@match', config: {pattern: '^[0-9]{14}$', message: 'Not a valid SIRET'}}]})