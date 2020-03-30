import React, {useState} from 'react';
import Tabs from '../src/Tabs';

export default {
    title: 'Tabs',
    component: Tabs,
}

export const basic = () => {
    const [tab, setTab] = useState(undefined);
    return (
        <Tabs tab={tab} tabs={[
            {name: 'a', label: 'Tab A', default: true, component: () => <div>Hello !</div>},
            {name: 'b', label: 'Tab B', component: () => <div>World !</div>},
            {name: 'c', label: 'Tab C', component: () => <div>Bye !</div>},
        ]} onChange={setTab} />
    );
};