import React, {ComponentType, forwardRef} from 'react';
import {buildStyle} from '../utils';

export const TextObject: ComponentType<TextObjectProps> = forwardRef(({object, ...props}: TextObjectProps, ref: any) => (
    <div ref={ref} {...props} style={{textAlign: 'center', alignItems: 'center', backgroundColor: (object.data || {}).color || 'yellow', ...buildStyle(object)}}>{(object.data || {}).text}</div>
));

export interface TextObjectProps {
    object?: any,
    [key: string]: any,
}

export default TextObject