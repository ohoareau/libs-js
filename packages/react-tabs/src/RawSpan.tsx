import React, {ComponentType, forwardRef} from 'react';

const RawSpan: ComponentType<RawSpanProps> = forwardRef(({children, onMouseOver, onMouseLeave, onTouchStart, onTouchEnd, onBlur, onFocus, title}: RawSpanProps, ref: any) => (
    <span ref={ref} {...{onMouseOver, onMouseLeave, onTouchStart, onTouchEnd, onBlur, onFocus, title}}>{children}</span>
));

export interface RawSpanProps {
    children?: any,
    onMouseOver?: any,
    onMouseLeave?: any,
    onTouchStart?: any,
    onTouchEnd?: any,
    onBlur?: any,
    onFocus?: any,
    title?: any,
}

export default RawSpan