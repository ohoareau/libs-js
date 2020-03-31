import React from 'react';
import Designer from "../src/Designer";

export default {
    title: 'Designer',
    component: Designer,
}

const templates = {
    template1: {
        fragments: [
            {id: 'chapter1', name: 'Chapter 1'},
            {id: 'chapter2', name: 'Chapter 2'},
            {id: 'chapter3', name: 'Chapter 3'},
            {id: 'chapter4', name: 'Chapter 4'},
            {id: 'chapter5', name: 'Chapter 5'},
            {id: 'chapter6', name: 'Chapter 6'},
        ],
    },
    template2: {
        fragments: [
            {
                id: 'cover',
                name: 'Couverture',
                header: [
                    {type: '@building:documentCoverLogo'}
                ],
                footer: [
                    {type: '@building:documentFooter'}
                ],
                content: [
                    {type: '@building:documentCoverFrame'},
                    {type: '@building:documentCoverQrCode'}
                ],
            },
            {
                id: 'summary',
                name: 'Sommaire',
                header: [
                    {type: '@building:documentHeader'},
                ],
                footer: [
                    {type: '@building:documentFooter'}
                ],
                content: [
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                    {type: 'summarySection'},
                ],
            },
            {
                id: 'constructio-presentation',
                name: 'Présentation de Constructio',
                header: [
                    {type: '@building:documentHeader'},
                ],
                footer: [
                    {type: '@building:documentFooter'}
                ],
                content: [
                    {type: 'constructioPresentationSection'}
                ],
            },
            {
                id: 'reference-documents',
                name: 'Documents de références',
                header: [
                    {type: '@building:documentHeader'},
                ],
                footer: [
                    {type: '@building:documentFooter'}
                ],
                content: [
                    /*
                    {type: 'title1', title: 'Document de références'},
                    {type: 'paragraph', text: "La note de calcul a été élaborée suivant les référentiels ci-dessous :"},
                    {type: 'table', data: [
                            {title: "Norme dallage DTU13-3 NF P 11-213-1", date: '2005-03'},
                            {title: "Amendement A1 à la Norme dallage DTU13-3 NF P 11-213-1", date: '2007-05'},
                            {title: "Recommandation ASIRI (dans le cas de renforcement de sol par inclusions)", date: '2012-07'},
                            {title: "BAEL"},
                    ], columns: [
                            {id: 'index', label: '#'},
                            {id: 'title', label: 'Référentiel', format: 'string'},
                            {id: 'date', label: 'Date de référence', format: 'month'},
                    ]}
                     */
                ],
            },
            {
                id: 'presentation',
                name: 'Présentation',
                header: [
                    {type: '@building:documentHeader'},
                ],
                footer: [
                    {type: '@building:documentFooter'}
                ],
                content: [
                ],
            },
            {
                id: 'properties',
                name: 'Caractéristiques du dallage',
                header: [
                    {type: '@building:documentHeader'},
                ],
                footer: [
                    {type: '@building:documentFooter'}
                ],
                content: [
                ],
            },
            {
                id: 'soils',
                name: 'Hypothèses des sols',
                header: [
                    {type: '@building:documentHeader'},
                ],
                footer: [
                    {type: '@building:documentFooter'}
                ],
                content: [
                ],
            },
            {
                id: 'loads',
                name: 'Hypothèses des charges',
                header: [
                    {type: '@building:documentHeader'},
                ],
                footer: [
                    {type: '@building:documentFooter'}
                ],
                content: [
                ],
            },
            {
                id: 'other-properties',
                name: 'Spécifications complémentaires',
                header: [
                    {type: '@building:documentHeader'},
                ],
                footer: [
                    {type: '@building:documentFooter'}
                ],
                content: [
                ],
            },
            {
                id: 'results-summary',
                name: 'Synthèse des résultats',
                header: [
                    {type: '@building:documentHeader'},
                ],
                footer: [
                    {type: '@building:documentFooter'}
                ],
                content: [
                ],
            },
            {
                id: 'detailed-results',
                name: 'Résultats détaillés',
                header: [
                    {type: '@building:documentHeader'},
                ],
                footer: [
                    {type: '@building:documentFooter'}
                ],
                content: [
                ],
            },
            {
                id: 'annexes',
                name: 'Annexes',
                header: [
                ],
                footer: [
                ],
                content: [
                ],
            },
            {
                id: 'end-cover',
                name: 'Quatrième de couverture',
                header: [
                ],
                footer: [
                ],
                content: [
                ],
            },
        ],
    }
};

export const template1 = () => (
    <Designer model={{}} template={templates.template1} data={{}} />
);

export const template2 = () => (
    <Designer model={{}} template={templates.template2} data={{}} />
);