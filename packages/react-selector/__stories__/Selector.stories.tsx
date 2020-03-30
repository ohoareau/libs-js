import React from 'react';
import Selector from '../src/Selector';

const DummyItem = (props: {item: {[key: string]: any}}) => <div style={{padding: 15, width: '100%', backgroundColor: props.item.color}}>{props.item.text}</div>;

export default {
    title: 'Selector',
    component: Selector,
}

export const basic = () => <Selector space={3} component={DummyItem} onChange={id => alert(`${id} clicked!`)} items={[
    {id: 'a', color: 'green', text: 'Item One'},
    {id: 'b', color: 'yellow', text: 'Item Two'},
]} />;