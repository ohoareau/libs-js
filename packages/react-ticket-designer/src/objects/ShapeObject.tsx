import React, {ComponentType, forwardRef} from 'react';
import {buildStyle} from '../utils';

export const ShapeObject: ComponentType<ShapeObjectProps> = forwardRef(({object, svgComponent: SvgComp, ...props}: ShapeObjectProps, ref: any) => {
    switch ((object.data || {}).shape) {
        case 'rectangle':
            return (
                <svg ref={ref} {...props} style={buildStyle(object, {width: 400, height: 250})}>
                    <filter id="grayscale">
                        <feColorMatrix type="matrix" values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0   0   0  1 0" />
                    </filter>
                    <rect filter={'url(#grayscale)'} width="100%" height="100%" style={{fill: 'rgb(0,0,255)'}} />
                </svg>
            );
        case 'square':
            return (
                <svg ref={ref} {...props} style={buildStyle(object, {width: 300, height: 300})}>
                    <filter id="grayscale">
                        <feColorMatrix type="matrix" values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0   0   0  1 0" />
                    </filter>
                    <rect filter={'url(#grayscale)'} width="100%" height="100%" style={{fill: 'rgb(0,0,255)'}} />
                </svg>
            );
        case 'circle':
            return (
                <svg ref={ref} {...props} style={buildStyle(object, {width: 300, height: 300})}>
                    <filter id="grayscale">
                        <feColorMatrix type="matrix" values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0   0   0  1 0" />
                    </filter>
                    <circle filter={'url(#grayscale)'} cx="50%" cy="50%" r="50%" fill="red" />
                </svg>
            );
        case 'line':
            return (
                <svg ref={ref} {...props} style={buildStyle(object, {width: 300, height: 5})}>
                    <filter id="grayscale">
                        <feColorMatrix type="matrix" values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0   0   0  1 0" />
                    </filter>
                    <line filter={'url(#grayscale)'} x1="0" y1="50%" x2="100%" y2="50%" style={{stroke: 'rgb(255,0,0)', strokeWidth: '50%'}} />
                </svg>
            );
        case 'svg-file':
            return (
                <div ref={ref} {...props} style={buildStyle(object, {width: 300, height: 300})}>
                    <SvgComp name={(object.data || {}).name} style={{width: '100%', height: '100%'}} />
                </div>
            );
        default:
            return null;
    }
});

export interface ShapeObjectProps {
    object?: any,
    [key: string]: any,
}

export default ShapeObject