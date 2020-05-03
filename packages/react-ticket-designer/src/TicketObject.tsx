import React, {forwardRef, useEffect, useRef, useState, ComponentType} from 'react';
import ObjectsPrimitives from './ObjectsPrimitives';
import component from "@ohoareau/react-component";

export const TextObject: ComponentType<TextObjectProps> = forwardRef(({object, ...props}: TextObjectProps, ref: any) => (
    <div ref={ref} {...props} style={{textAlign: 'center', alignItems: 'center', position: 'absolute', width: 300, height: 300, backgroundColor: object.color || 'yellow'}}>{object.text}</div>
));

export interface TextObjectProps {
    object?: any,
    [key: string]: any,
}

export const ImageObject: ComponentType<ImageObjectProps> = forwardRef(({object, ...props}: ImageObjectProps, ref: any) => (
    <img ref={ref} alt={'block'} src={object.url} {...props} style={{borderRadius: '50%', textAlign: 'center', alignItems: 'center', position: 'absolute', width: 300, height: 300}} />
));

export interface ImageObjectProps {
    object?: any,
    [key: string]: any,
}

export const ShapeObject: ComponentType<ShapeObjectProps> = forwardRef(({object, svgComponent: SvgComp, ...props}: ShapeObjectProps, ref: any) => {
    switch (object.shape) {
        case 'rectangle':
            return (
                <svg ref={ref} {...props} style={{position: 'absolute', width: 400, height: 250}}>
                    <rect width="100%" height="100%" style={{fill: 'rgb(0,0,255)', strokeWidth: 3, stroke: 'rgb(0,0,0)'}} />
                </svg>
            );
        case 'square':
            return (
                <svg ref={ref} {...props} style={{position: 'absolute', width: 300, height: 300}}>
                    <rect width="100%" height="100%" style={{fill: 'rgb(0,0,255)', strokeWidth: 3, stroke: 'rgb(0,0,0)'}} />
                </svg>
            );
        case 'circle':
            return (
                <svg ref={ref} {...props} style={{position: 'absolute', width: 300, height: 300}}>
                    <circle cx="50%" cy="50%" r="50%" fill="red" />
                </svg>
            );
        case 'line':
            return (
                <svg ref={ref} {...props} style={{position: 'absolute', width: 300, height: 5}}>
                    <line x1="0" y1="50%" x2="100%" y2="50%" style={{stroke: 'rgb(255,0,0)', strokeWidth: '50%'}} />
                </svg>
            );
        case 'svg-file':
            return (
                <div ref={ref} {...props} style={{position: 'absolute', width: 300, height: 300}}>
                    <SvgComp name={object.name} style={{width: '100%', height: '100%'}} />
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

export const FieldObject: ComponentType<FieldObjectProps> = forwardRef(({object, ...props}: FieldObjectProps, ref: any) => (
    <div ref={ref} {...props} style={{position: 'absolute', width: 300, height: 300, backgroundColor: object.color || 'yellow'}}>FIELD</div>
));

export interface FieldObjectProps {
    object?: any,
    [key: string]: any,
}

export const UnknownObject: ComponentType<UnknownObjectProps> = forwardRef(({object, ...props}: UnknownObjectProps, ref: any) => (
    <div ref={ref} {...props} style={{position: 'absolute', width: 300, height: 300, backgroundColor: object.color || 'red'}}>UNKNOWN</div>
));

export interface UnknownObjectProps {
    object?: any,
    [key: string]: any,
}

const objectTypes = {
    text: TextObject,
    image: ImageObject,
    shape: ShapeObject,
    field: FieldObject,
    default: UnknownObject,
};

export const TicketObject = component<TicketObjectProps>(undefined, ({object, containerNode, onToggleSelect, onToggleFocus, svgComponent}: TicketObjectProps) => {
    const objectRef = useRef(null as any);
    const [renderMovable, setRenderMovable] = useState(undefined as any);
    const Component = objectTypes[object.type] || objectTypes.default;
    useEffect(() => {
        !object.group && setRenderMovable((object as any).selected ? 'selected' : ((object as any).focused ? 'focused' : undefined));
    }, [object.group, object.selected, object.focused]);
    return (
        <>
            <Component svgComponent={svgComponent} onMouseEnter={object.focused ? e => e.stopPropagation() : e => {onToggleFocus(e); e.stopPropagation();}} onMouseLeave={!object.focused ? e => e.stopPropagation() : e => {onToggleFocus(e); e.stopPropagation();}} onClick={object.selected ? e => e.stopPropagation() : onToggleSelect} ref={objectRef} object={object} />
            {!!renderMovable && <ObjectsPrimitives mode={renderMovable} target={objectRef.current} container={containerNode} />}
        </>
    );
});

export interface TicketObjectProps {
    object?: any,
    containerNode?: any,
    onToggleSelect?: any,
    onToggleFocus?: any,
    svgComponent: any,
}

export default TicketObject