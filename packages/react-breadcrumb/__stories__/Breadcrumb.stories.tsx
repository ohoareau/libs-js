import React, {useCallback} from 'react';
import Breadcrumb from '../src/Breadcrumb';

export default {
    title: 'Breadcrumb',
    component: Breadcrumb,
}

export const basic = () => {
    const onClick = useCallback(it => alert(`You clicked: ${JSON.stringify(it)}`), []);
    return <Breadcrumb parentScopes={[{name: 'P1'}, {name: 'P2'}, {name: 'P3'}]} scope={{name: 'P4'}}  onSelect={onClick} />;
};
