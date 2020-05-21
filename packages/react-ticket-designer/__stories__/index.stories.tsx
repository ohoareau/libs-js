import React, {lazy, memo, Suspense, useCallback, useState} from 'react';
import {TicketDesigner} from '../src';

const caches = {};

const ticketLoader = n => () => require(`./tickets/${n}.json`).content;

const getSvgFileComponent = (name) => {
    if (!caches[name]) {
        const path = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
        const Component = lazy(() => import(`./svgs/${path}.tsx`));
        caches[name] = memo(props  => (
            <Suspense fallback={<div />}>
                <Component {...props} />
            </Suspense>
        ));
    }
    return caches[name];
};

const SvgComponent = ({name, ...props}: any) => {
    const Component = getSvgFileComponent(name);
    return <Component {...props} />;
};

export default {
    title: 'TicketDesigner',
    component: TicketDesigner,
}

export const basic = () => {
    const [, onChange] = useState();
    const handleChange = useCallback(v => {
        console.log(JSON.stringify(v));
        onChange(v);
    }, [onChange]);
    return (
        <TicketDesigner svgComponent={SvgComponent} onChange={handleChange} />
    );
}

const loadTicket = n => () => {
    const [value, onChange] = useState(ticketLoader(n));
    return (
        <TicketDesigner defaultValue={value} svgComponent={SvgComponent} onChange={onChange} />
    );
}

export const loadTicket1 = loadTicket('ticket1');
export const loadTicket4 = loadTicket('ticket4');
export const loadTicket5 = loadTicket('ticket5');