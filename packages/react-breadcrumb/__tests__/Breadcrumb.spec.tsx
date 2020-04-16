/**
 * @jest-environment jsdom
 */
import React from 'react';
import {render, fireEvent} from '@testing-library/react';

import {Breadcrumb} from '../src';

describe("<Breadcrumb ... />", () => {
    test("with no items should display nothing", async () => {
        const {queryAllByRole}  = render(<Breadcrumb />);
        expect(queryAllByRole('breadcrumb-item').length).toEqual(0);
    });
    test("with item but no parents should display 1 span", async () => {
        const {queryAllByRole} = render(<Breadcrumb item={{}} scope={{name: 'Item Scope Name'}} />);
        const items = queryAllByRole('breadcrumb-item');
        expect(items.length).toEqual(1);
        expect(items[0]).toHaveTextContent('Item Scope Name');
    });
    test("with item and one parent should display 2 spans", async () => {
        const {queryAllByRole} = render(<Breadcrumb item={{}} scope={{name: 'Item Scope Name 2'}} parentScopes={[{name: 'The Parent Scope'}]} />);
        const items = queryAllByRole('breadcrumb-item');
        expect(items.length).toEqual(2);
        expect(items[0]).toHaveTextContent('The Parent Scope');
        expect(items[1]).toHaveTextContent('Item Scope Name 2');
    });
    test("with item and N parents (N>1) should display N+1 spans", async () => {
        const {queryAllByRole} = render(<Breadcrumb item={{}} scope={{name: 'Item Scope Name 3'}} parentScopes={[{name: 'The Parent Scope 1'}, {name: 'The Parent Scope 2'}, {name: 'The Parent Scope 3'}]} />);
        const items = queryAllByRole('breadcrumb-item');
        expect(items.length).toEqual(4);
        expect(items[0]).toHaveTextContent('The Parent Scope 1');
        expect(items[1]).toHaveTextContent('The Parent Scope 2');
        expect(items[2]).toHaveTextContent('The Parent Scope 3');
        expect(items[3]).toHaveTextContent('Item Scope Name 3');
    });
    test("with click on item should trigger onClick with the scope of the item", async () => {
        const clicks = [] as any[];
        const onClick = data => clicks.push(data);
        const {getByText} = render(<Breadcrumb onSelect={onClick} item={{}} scope={{name: 'Item Scope Name'}} />);
        fireEvent.click(getByText('Item Scope Name'));
        expect(clicks).toEqual([
            {context: undefined, item: {}, scope: {name: 'Item Scope Name'}},
        ]);
    });
    test("with click on parent item should trigger onClick with the scope of the parent item and not the item", async () => {
        const clicks = [] as any[];
        const onClick = data => clicks.push(data);
        const {getByText} = render(<Breadcrumb onSelect={onClick} item={{}} scope={{name: 'Item Scope Name'}} parentScopes={[{name: 'The Parent Scope 10'}]} />);
        fireEvent.click(getByText('The Parent Scope 10'));
        expect(clicks).toEqual([
            {context: undefined, item: {}, scope: {name: 'The Parent Scope 10'}},
        ]);
    });
});