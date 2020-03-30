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
};

export const basic = () => (
    <Designer model={{}} template={templates.template1} data={{}} />
);