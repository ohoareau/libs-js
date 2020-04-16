export default {
    id: 'extended',
    name: 'Complet',
    default: true,
    priority: 11,
    suggestions: [
        {id: 'sug001', condition: '$sites.length > 3', type: 'paragraph', text: 'Ceci est le texte de la suggestion', tags: ['tag1', 'tag2'], displayName: 'Mention spéciale pas de charge lourde'},
        {id: 'sug002', type: 'paragraph', text: 'Ceci est le **texte** de l\'autre _suggestion_', tags: ['tag1'], displayName: 'Ceci est une autre suggestion'},
        {id: 'sug003', type: 'paragraph', text: '## Ceci est le **texte** de l\'autre _suggestion_', tags: ['tag3'], displayName: 'Ceci est encore une autre suggestion'},
        {id: 'sug004', type: 'paragraph', text: '# Ceci est le **texte** de l\'autre _suggestion_', tags: ['tag2', 'tag3', 'tag1'], displayName: 'Ceci est la dernière suggestion'},
    ],
    fragments: [
        {
            id: 'cover',
            name: 'Couverture',
            content: [
                {id: 'b1', type: '@building:documentCoverLogo', hiddable: true, displayName: 'Logo'},
                {id: 'b2', type: '@building:documentCoverFrame', displayName: 'Cartouche', title: 'SCI QUERCI', subTitle: 'Note de calcul dallage (version 2)'},
                {id: 'b3', type: 'paragraph', displayName: 'Paragraphe', hiddable: true, text: "Retrouvez cette note de calcul directement en ligne :\nhttp://www.dtu13-3.com/public/telecharger/affaires/d77c3d29cd644099f52232a95a551c34/notes-decalculs/66c6fd0b57ff44212b5f1723a56865cf"},
                {id: 'b4', type: 'layout', layout: 'row010', content: {
                        left: {id: 'b4l', type: 'qrcode', displayName: 'QRCode', hiddable: true, size: 50, value: 'http://www.dtu13-3.com/bundles/amotpl/themes/bottom-line/images/calculs.png'},
                        center: undefined,
                        right: undefined,
                    }},
            ],
        },
        {
            id: 'summary',
            name: 'Sommaire',
            header: [
                {id: 'b3', type: 'layout', layout: 'row011', content: {
                    col1: {id: 'b3a', type: 'paragraph', displayName: 'Logo', hiddable: true, text: 'LOGO'},
                    col2_line1: {id: 'b3b', type: 'paragraph', displayName: 'Paragraphe', text: 'SCI QUERCI'},
                    col2_line2: {id: 'b3c', type: 'paragraph', displayName: 'Paragraphe', text: 'Note de calcul dallage indice 2 en date du 19/12/2019'},
                }},
            ],
            footer: [
                {id: 'b4', type: '@building:documentFooter'}
            ],
            content: [
            ],
        },
        {
            id: 'constructio-presentation',
            name: 'Présentation de Constructio',
            header: [
            ],
            footer: [
                {type: '@building:documentFooter'}
            ],
            content: [
                {
                    id: 'b11',
                    type: 'heading',
                    displayName: 'Titre 1',
                    level: 1,
                    text: "Présentation du service DTU13-3.com d'AMOCER-IDF",
                },
                {
                    id: 'b12',
                    type: 'paragraph',
                    displayName: 'Paragraphe',
                    text: `Cette note de calcul vous est fournie grâce au service en ligne DTU13-3.com, le premier service *SaaS* de construction dallage béton.
### DTU13-3.com
Grâce à [DTU13-3.com](http://www.dtu13-3.com), rédigez votre note de calcul de dallage béton en quelques minutes :`,
                },
                {
                    id: 'b15',
                    type: 'list',
                    displayName: 'Liste',
                    items: [
                        {id: 'b15_a', type: 'paragraph', displayName: 'Paragraphe', text: "Gestion de votre affaire"},
                        {id: 'b15_b', type: 'paragraph', displayName: 'Paragraphe', text: "Saisie données sols, charges, specs ..."},
                        {id: 'b15_c', type: 'paragraph', displayName: 'Paragraphe', text: "Sélection de solutions de dallage conforme norme DTU13-3"},
                        {id: 'b15_d', type: 'paragraph', displayName: 'Paragraphe', text: "Création assistée d'une note de calcul professionnelle"},
                        {id: 'b15_e', type: 'paragraph', displayName: 'Paragraphe', text: "..."},
                    ]
                },
                {
                    id: 'b16',
                    type: 'paragraph',
                    displayName: 'Paragraphe',
                    text: `Pour obtenir de plus amples informations sur ce service, rendez-vous sur :

http://www.dtu13-3.com

Ce service est fourni par la société AMOCER-IDF (http://www.amocer-idf.com)

L'utilisation du logiciel est soumis a un contrat d'utilisation entre la société de l'utilisateur (Emetteur) et la société AMOCER-IDF. Il est notamment spécifié dans ce contrat que`,
                },
                {
                    id: 'b20',
                    type: 'list',
                    displayName: 'Liste',
                    items: [
                        {
                            id: 'b20_a',
                            type: 'paragraph',
                            displayName: 'Paragraphe',
                            text: "La mise à disposition des solutions du Service DTU13-3 ne peut être considérée comme une mission de Bureau d'études Techniques béton de la part de la société AMOCER-IDF",
                        },
                        {
                            id: 'b20_b',
                            type: 'paragraph',
                            displayName: 'Paragraphe',
                            text: "La mise à disposition des solutions du Service DTU13-3 ne dispense pas les société utilisatrices de souscrire à une assurance liée à l'activité du Service DTU13-3",
                        },
                        {
                            id: 'b20_c',
                            type: 'paragraph',
                            displayName: 'Paragraphe',
                            text: "...",
                        }
                    ]
                },
                {
                    id: 'b21',
                    type: 'paragraph',
                    displayName: 'Paragraphe',
                    text: "Dans le cas ou l'Emetteur est la société AMOCER-IDF, la note de calcul rentre dans le cadre des prestations BET Beton (soit de type partiel: établissement d'une note de calcul , soit de type global: conception éxecution ) de la société AMOCER-IDF couverte par sa police d'assurance.",
                    hiddable: true,
                }
            ],
        },
        {
            id: 'reference-documents',
            name: 'Documents de références',
            header: [
                {id: 'b30', type: '@building:documentHeader'},
            ],
            footer: [
                {id: 'b31', type: '@building:documentFooter'}
            ],
            content: [
                {id: 'b32', type: 'heading', displayName: 'Titre 1', level: 1, text: '1. Documents de références'},
                {id: 'b33', type: 'paragraph', displayName: 'Paragraphe', text: "La note de calcul a été élaborée suivant les référentiels ci-dessous :"},
                {id: 'b34', type: 'table', displayName: 'Tableau', data: [
                        {title: "Norme dallage DTU13-3 NF P 11-213-1", date: '2005-03'},
                        {title: "Amendement A1 à la Norme dallage DTU13-3 NF P 11-213-1", date: '2007-05'},
                        {title: "Recommandation ASIRI (dans le cas de renforcement de sol par inclusions)", date: '2012-07'},
                        {title: "BAEL"},
                    ], columns: [
                        {id: 'index', label: '#', span: 1},
                        {id: 'title', label: 'Référentiel', format: 'string', span: 9},
                        {id: 'date', label: 'Date de référence', format: 'month', span: 2},
                    ]},
                {id: 'b35', type: 'space', displayName: 'Espace', hiddable: true},
                {id: 'b36', type: 'paragraph', displayName: 'Paragraphe', text: "Les documents ayant servis à son élaboration sont les suivants :"},
                {id: 'b37', type: 'table', displayName: 'Tableau', data: [
                        {title: "Annexe1 : références, analyses, commentaires sur les documents reçus (20191004 omnium dallage -sci querci - vitrolles (13) indice 1.pdf)"},
                    ], columns: [
                        {id: 'index', label: '#', span: 1},
                        {id: 'title', label: 'Nom du document', format: 'string', span: 11},
                    ]}
            ],
        },
        {
            id: 'presentation',
            name: 'Présentation',
            header: [
                {id: 'b40', type: '@building:documentHeader'},
            ],
            footer: [
                {id: 'b41', type: '@building:documentFooter'}
            ],
            content: [
                {id: 'b42', type: 'heading', displayName: 'Titre 1', enrichable: true, level: 1, text: '2. Présentation du projet'},
                {id: 'b43', type: 'paragraph', displayName: 'Paragraphe', enrichable: true, suggestions: ['@tag1'], text: "Pour la réalisation de cette note, le projet a été découpé en **{{nb sites}} {{#multiple sites}}bâtiments{{else}}bâtiment{{/multiple}}**"},
                {id: 'b44', type: 'paragraph', displayName: 'Paragraphe', enrichable: true, text: "Un découpage par zone a été réalisé en fonction des spécifications techniques de chaque zone, la décomposition a été réalisée de la manière suivante :"},
                {id: 'b441', foreach: '$sites', type: 'table', displayName: 'Tableau', enrichable: true, title: "Bâtiment {{name}}", headers: true, data: '$buildings', columns: [
                        {id: 'index', span: 1},
                        {id: 'name', format: 'string', span: 4},
                        {id: 'description', format: 'string', span: 7},
                    ]}
            ],
        },
        {
            id: 'properties',
            name: 'Caractéristiques du dallage',
            header: [
                {id: 'b45', type: '@building:documentHeader'},
            ],
            footer: [
                {id: 'b46', type: '@building:documentFooter'}
            ],
            content: [
                {id: 'b47', type: 'heading', displayName: 'Titre 1', enrichable: true, level: 1, text: '3. Caractéristiques du dallage'},
                {id: 'b47x', type: 'group', foreach: '$sites[0].buildings', enrichable: true, content: [
                    {id: 'b471', type: 'heading', displayName: 'Titre 2', level: 2, text: '1. Bâtiment {{name}}'},
                    {id: 'b4711', type: 'table', displayName: 'Tableau', data: [
                            {zone: "Entrepôt", thickness: "20 cm", slabType: "béton fibré", resistance: "30 Mpa", description: "BEKAERT - 3D 45/50 BL - 25kg - ST15C treillis pour conjugaison - Beton Fctk Fendage 3 Mpa"},
                            {zone: "Bureaux", thickness: "13 cm", slabType: "BA (Béton armé)", resistance: "25 Mpa", description: "ST 50 C centré"},
                        ], columns: [
                            {id: 'zone', label: 'Zone', span: 2},
                            {id: 'thickness', label: 'Epaisseur', format: 'string', span: 2},
                            {id: 'slabType', label: 'Type de dallage', format: 'string', span: 2},
                            {id: 'resistance', label: 'Résistance compression', format: 'string', span: 2},
                            {id: 'description', label: 'Description', format: 'string', span: 4},
                        ]},
                ]},
                {id: 'b472', type: 'heading', displayName: 'Titre 4', enrichable: true, level: 4, text: 'Rappel des hypothèses retenues pour les dallages'},
                {id: 'b4721', type: 'paragraph', displayName: 'Paragraphe', text: "Dallage désoliarisé de la structure : si ce n'était pas le cas, des dispositions spécifiques devront être prises pour le dallage en collaboration avec le BET structure de l'opération."},
                {id: 'b4722', type: 'paragraph', displayName: 'Paragraphe', text: "Il est rappelé que les dallages de type non armé ou fibré ne peuvent reprendre des efforts de type structurel. Les dalles de type armé peuvent nécessiter pour leur part des justifications complémentaires."},
                {id: 'b4723', type: 'paragraph', displayName: 'Paragraphe', text: "Les équipements nécessitant la reprise d'effort de traction vers le haut ou de moment d'encastrement ne font pas partie de la justification des dallages suivant l'annexe C du DTU13-3 : ils devront faire l'objet de justifications spécifiques."},
                {id: 'b4724', type: 'paragraph', displayName: 'Paragraphe', text: "Les dallages liaisonnés aux seuils et quais ou ouvrages similaires doivent être calculés en dalle de transition avec un pourcentage minimum d'armatures de 0,2% dans chaque drection en nappe inférieure, et disposés sur la totalité du panneau concerné pour les dallages de type non armé ou fibré."},
                {id: 'b4725', type: 'paragraph', displayName: 'Paragraphe', text: "Les équipements industriels générateurs de vibrations, chocs, ou imposant des tolérances de service plus sévères que les tolérances d'exécution combinées avec les tassements prévisibles ne rentrent pas dans le cadre de DTU13-3."},
                {id: 'b4726', type: 'paragraph', displayName: 'Paragraphe', text: "Les critères de déformation restent ceux de DTU13-3 : les équipements nécessitant des critères plus contraignants doivent éventuellement faire l'objet d'analyse plus fine à réaliser en dehors de cette note."},
                {id: 'b4727', type: 'paragraph', displayName: 'Paragraphe', text: "Dans le cas de béton de fibres la réalisation devra vérifier les spécification du DTA de la fibre. Le choix d'utiliser les valeurs maximales des DTA dans le cas renforcement de sol avec ASIRI reste de la responsabilité de l'utilisateur."},
                {id: 'b4728', type: 'paragraph', displayName: 'Paragraphe', text: "Dans le cas de béton avec une caractéristique au fendage la conformité doit être apportée soit par le BPE, soit par des controles: la valeur caractéristique est égale à la moyenne moins Ks fois l'écart type avec Ks coefficient de Student dépendant du nombre d'échantillon (2.015 pour 6 échantillons, 1.86 pour 9 échantillons)."},
            ],
        },
        {
            id: 'soils',
            name: 'Hypothèses des sols',
            header: [
                {id: 'b48', type: '@building:documentHeader'},
            ],
            footer: [
                {id: 'b49', type: '@building:documentFooter'}
            ],
            content: [
                {id: 'b50', type: 'heading', displayName: 'Titre 1', level: 1, text: '4. Hypothèses des sols'},
                {id: 'b501', type: 'heading', displayName: 'Titre 2', level: 2, text: '1. Bâtiment principal'},
                {id: 'b5011', type: 'heading', displayName: 'Titre 3', level: 3, text: '1.1. Bâtiment principal - Entrepôt'},
                {id: 'b50111', type: 'paragraph', displayName: 'Paragraphe', hiddable: true, text: "**Remarque** : Les données de sols sont spécifiées sous forme d'épaisseurs de couches."},
                {id: 'b501111', type: 'table', displayName: 'Tableau', data: [
                        {label: "Plateforme", height: 0.5, youngModule: 30},
                        {label: "Surélévation( ??)", height: 1, youngModule: 15},
                        {label: "Calcaire", height: 20, youngModule: 80},
                    ], columns: [
                        {id: 'index', span: 1},
                        {id: 'label', label: 'Libellé', span: 6},
                        {id: 'height', label: 'Epaisseur (m)', format: 'string', span: 2},
                        {id: 'youngModule', label: "Module d'Young", format: 'string', span: 3},
                    ]},
                {id: 'b5012', type: 'heading', displayName: 'Titre 3', pagebreak: true, level: 3, text: '1.2. Bâtiment principal - Bureaux'},
                {id: 'b50121', type: 'paragraph', displayName: 'Paragraphe', hiddable: true, text: "**Remarque** : Les données de sols sont spécifiées sous forme d'épaisseurs de couches."},
                {id: 'b501211', type: 'table', displayName: 'Tableau', data: [
                        {label: "Couche #1", height: 0.5, youngModule: 30},
                        {label: "Couche #2", height: 2, youngModule: 8},
                        {label: "Couche #3", height: 3, youngModule: 14},
                        {label: "Couche #4", height: 4, youngModule: 20},
                        {label: "Couche #5", height: 10, youngModule: 60},
                        {label: "Couche #6", height: 1, youngModule: 99999},
                    ], columns: [
                        {id: 'index', span: 1},
                        {id: 'label', label: 'Libellé', span: 6},
                        {id: 'height', label: 'Epaisseur (m)', format: 'string', span: 2},
                        {id: 'youngModule', label: "Module d'Young", format: 'string', span: 3},
                    ]},
            ],
        },
        {
            id: 'loads',
            name: 'Hypothèses des charges',
            header: [
                {id: 'b51', type: '@building:documentHeader'},
            ],
            footer: [
                {id: 'b52', type: '@building:documentFooter'}
            ],
            content: [
                {id: 'b53', type: 'heading', displayName: 'Titre 1', level: 1, text: '5. Hypothèses des charges'},
            ],
        },
        {
            id: 'other-properties',
            name: 'Spécifications complémentaires',
            header: [
                {id: 'b54', type: '@building:documentHeader'},
            ],
            footer: [
                {id: 'b55', type: '@building:documentFooter'}
            ],
            content: [
                {id: 'b56', type: 'heading', displayName: 'Titre 1', level: 1, text: '6. Spécifications complémentaires'},
            ],
        },
        {
            id: 'results-summary',
            name: 'Synthèse des résultats',
            header: [
                {id: 'b57', type: '@building:documentHeader'},
            ],
            footer: [
                {id: 'b58', type: '@building:documentFooter'}
            ],
            content: [
                {id: 'b59', type: 'heading', displayName: 'Titre 1', level: 1, text: '7. Synthèses des résultats'},
            ],
        },
        {
            id: 'detailed-results',
            name: 'Résultats détaillés',
            header: [
                {id: 'b60', type: '@building:documentHeader'},
            ],
            footer: [
                {id: 'b61', type: '@building:documentFooter'}
            ],
            content: [
                {id: 'b62', type: 'heading', displayName: 'Titre 1', level: 1, text: '8. Résultats détaillés'},
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
                {id: 'b63', type: 'heading', displayName: 'Titre 1', level: 1, text: 'Annexes'},
                {id: 'b64', type: 'paragraph', displayName: 'Paragraphe', text: "Dans la suite du document, vous trouverez le contenu de certains documents de références annexés à la note de calcul :"},
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