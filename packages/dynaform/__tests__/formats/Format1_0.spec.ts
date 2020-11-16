import Format1_0 from '../../src/formats/Format1_0';
import ValidationError from '../../src/errors/ValidationError';

describe('validate', () => {
    it('pass with conform definition', () => {
        const format = new Format1_0();
        expect(() => format.validate({
            format: '1.0',
            models: {
                open: {
                    type: 'text',
                    label: 'Open question ?',
                    config: {
                        multiline: true
                    },
                    validators: {
                        'not-null': true
                    },
                    rules: {
                        'rule-1': 'rule 1'
                    }
                },
                rating: {
                    type: 'cursor',
                    label: 'How do you rate it?',
                    config: {
                        low: 1,
                        high: 10,
                        step: 1,
                        'label-low': 'I hate it',
                        'label-high': 'I like it'
                    },
                    validators: {
                        'not-null': true
                    },
                    rules: {
                        'rule-2': 'rule 2'
                    }
                },
                single: {
                    type: 'choice',
                    label: 'single?',
                    choices: [
                        {'key': 'yes', 'label': 'Yes'},
                        'No',
                        'I don\'t know'
                    ],
                    config: {
                        multiple: false
                    },
                    validators: {},
                    rules: {}
                },
                howMany: {
                    type: 'choice',
                    label: 'how many ?',
                    choices: [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    config: {
                        multiple: false
                    }
                },
                multi: {
                    type: 'choice',
                    label: 'Choice min 3 and max 3 ?',
                    choices: [
                        'choice 1',
                        'choice 2',
                        'choice 3',
                        'choice 4',
                        'choice 5',
                        'choice 6',
                        'choice 7',
                        'choice 8',
                    ],
                    "config": {
                        "multiple": true,
                    },
                    "validators": {
                        "not-null": true,
                        "min": 3,
                        "max": 3
                    }
                },
                feeling: {
                    type: 'feeling',
                    label: 'Question',
                    config: {
                        default: 1
                    }
                }
            },
            versions: {
                default: {
                    title: 'The title',
                    config: {
                        picture: 'https://my-bucket.s3.us-west-2.amazonaws.com/puppy.png',
                        template: 'template',
                        discard: {
                            caption: 'Discard?',
                            yes: 'Yes',
                            no: 'No'
                        },
                        browsing: {
                            next: 'Next',
                            previous: 'Back'
                        }
                    },
                    steps: [
                        {
                            content: [
                                {
                                    type: 'query',
                                    'model-property': 'rating',
                                    config: {}
                                },
                                {
                                    type: 'query',
                                    'model-property': 'multi',
                                }
                            ]
                        },
                        {
                            content: [
                                {
                                    type: 'informative',
                                    title: 'title',
                                    caption: 'caption',
                                    config: {
                                        template: 'template',
                                        picture: 'https://my-bucket.s3.us-west-2.amazonaws.com/puppy.png'
                                    }
                                },
                            ]
                        }
                    ]
                }
            },
            translations: {
               'fr_FR': {
                   'you': 'tu'
               }
            }
        })).not.toThrowError();
    });
    it('throw error on unknown root property ', () => {
        const format = new Format1_0();
        const expectedError = new ValidationError([
            {path: '', error: new Error('should NOT have additional properties ({"additionalProperty":"unknownProperty"})')},
        ]);
        expect(() => format.validate({
            models: {
                field1: {},
            },
            unknownProperty: 'don\'t know me'
        })).toThrowError(expectedError);
    });
    it('throw error if one model but no type for it', () => {
        const format = new Format1_0();
        const expectedError = new ValidationError([
            {path: '.models[\'field1\']', error: new Error('should have required property \'type\' ({"missingProperty":"type"})')},
            {path: '.models[\'field1\']', error: new Error('should have required property \'type\' ({"missingProperty":"type"})')},
            {path: '.models[\'field1\']', error: new Error('should match some schema in anyOf')},
        ]);
        expect(() => format.validate({
            format: "1.0",
            models: {
                field1: {},
            }
        })).toThrowError(expectedError);
    });
    it('throw error on bad schema version', () => {
        const format = new Format1_0();
        const expectedError = new ValidationError([
            {path: '.format', error: new Error('should be equal to constant ({"allowedValue":"1.0"})')},
        ]);
        expect(() => format.validate({
            format: '2.0',
            models: {}
        })).toThrowError(expectedError);
    });
    it('throw error on missing model type', () => {
        const format = new Format1_0();
        const expectedError = new ValidationError([
            {path: '.models[\'model\']', error: new Error('should have required property \'type\' ({"missingProperty":"type"})')},
            {path: '.models[\'model\']', error: new Error('should have required property \'type\' ({"missingProperty":"type"})')},
            {path: '.models[\'model\']', error: new Error('should match some schema in anyOf')},
        ]);
        expect(() => format.validate({
            format: '1.0',
            models: {
                model: {
                    label: 'label'
                }
            }
        })).toThrowError(expectedError);
    });
    it('throw error on missing model label', () => {
        const format = new Format1_0();
        const expectedError = new ValidationError([
            {path: '.models[\'model\']', error: new Error('should have required property \'label\' ({"missingProperty":"label"})')},
            {path: '.models[\'model\'].type', error: new Error('should be equal to one of the allowed values ({"allowedValues":["choice"]})')},
            {path: '.models[\'model\']', error: new Error('should match some schema in anyOf')},
        ]);
        expect(() => format.validate({
            format: '1.0',
            models: {
                model: {
                    type: 'text',
                }
            }
        })).toThrowError(expectedError);
    });
    it('throw error on unknown model type', () => {
        const format = new Format1_0();
        const expectedError = new ValidationError([
            {path: '.models[\'model\'].type', error: new Error('should be equal to one of the allowed values ({"allowedValues":["text","cursor","feeling"]})')},
            {path: '.models[\'model\'].type', error: new Error('should be equal to one of the allowed values ({"allowedValues":["choice"]})')},
            {path: '.models[\'model\']', error: new Error('should match some schema in anyOf')},
        ]);
        expect(() => format.validate({
            format: '1.0',
            models: {
                model: {
                    type: 'unknown type'
                }
            }
        })).toThrowError(expectedError);
    });
    it('throw error on unknown model property', () => {
        const format = new Format1_0();
        const expectedError = new ValidationError([
            {path: '.models[\'model\']', error: new Error('should NOT have additional properties ({"additionalProperty":"unknown"})')},
            {path: '.models[\'model\']', error: new Error('should NOT have additional properties ({"additionalProperty":"unknown"})')},
            {path: '.models[\'model\']', error: new Error('should match some schema in anyOf')},
        ]);
        expect(() => format.validate({
            format: '1.0',
            models: {
                model: {
                    type: 'text',
                    label: 'label',
                    unknown: 'property',
                }
            }
        })).toThrowError(expectedError);
    });
});