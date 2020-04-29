module.exports = {
    models: {
        model1: {
            attributes: {
                apeCode: {required: true},
                count: {required: true},
                email: {required: true},
                fax: {required: true},
                firstName: {required: true},
                flag: {required: true},
                lastName: {required: true},
                memberRole: {required: true},
                name: {required: true},
                number: {required: true, default: 42},
                password: {required: true},
                phone: {required: true},
                securityCode: {required: true},
                siren: {required: true},
                siret: {required: true},
                text: {required: true},
                thickness: {required: true},
                url: {required: true},
                username: {required: true},
                value: {required: true},
                vat: {required: true},
                zipCode: {required: true},
            },
            forms: {
                action1: {
                    contents: [
                        ['firstName', 'lastName']
                    ],
                },
                action2: {
                    contents: [
                        ['text', 'dyn>text'],
                        [{contentType: 'text', text: 'Please type "a" in the field.'}]
                    ],
                },
                action2_text_a: {
                    contents: [
                        [{contentType: 'text', text: 'Hello world !'}]
                    ],
                },
                action3: {
                    contents: [
                        ['apeCode'],
                        ['count'],
                        ['email'],
                        ['fax'],
                        ['firstName'],
                        ['flag'],
                        ['memberRole'],
                        ['name'],
                        ['number'],
                        ['password'],
                        ['phone'],
                        ['securityCode'],
                        ['siren'],
                        ['siret'],
                        ['text'],
                        ['thickness'],
                        ['url'],
                        ['username'],
                        ['value'],
                        ['vat'],
                        ['zipCode'],
                    ]
                }
            }
        },
        model2: {
            defaultValues: {
                "*": {
                    number: 42
                },
                type: {
                    a: {
                        number: 43,
                    },
                    b: {
                        number: 44,
                    }
                }
            },
            attributes: {
                name: {required: true},
                type: {type: "selector", values: [
                        {id: 'a', name: 'Type A'},
                        {id: 'b', name: 'Type B'},
                        {id: 'c', name: 'Type C'},
                        {id: 'd', name: 'Type D'},
                ]},
                number: {},
            },
            forms: {
                action1: {
                    contents: [
                        ['name'],
                        ['type'],
                        ['dyn>type'],
                    ]
                },
                action1_type_a: {
                    contents: [
                        ['number'],
                    ]
                }
            }
        },
    },
    translations: {
        en: {
            field_firstname_label: 'First Name',
            field_firstname_placeholder: 'Ex: John',
            field_lastname_label: 'Last Name',
            field_lastname_placeholder: 'Ex: Appleseed',
            constraints_email: 'Bad email format',
        },
    },
};