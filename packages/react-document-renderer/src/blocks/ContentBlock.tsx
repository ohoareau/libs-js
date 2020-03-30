import React from 'react';
import Block from '../Block';

const ContentBlock = ({block: {content = []}}) => (
    <>
        {content.map((b, i) => <Block key={i} block={b} />)}
    </>
);

export default ContentBlock