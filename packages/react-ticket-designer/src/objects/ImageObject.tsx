import React, {ComponentType, forwardRef} from 'react';

export const ImageObject: ComponentType<ImageObjectProps> = forwardRef(({object, ...props}: ImageObjectProps, ref: any) => (
    <img ref={ref} alt={'block'} src={(object.data || {}).url} {...props} style={{borderRadius: '50%', textAlign: 'center', alignItems: 'center', position: 'absolute', width: 300, height: 300}} />
));

export interface ImageObjectProps {
    object?: any,
    [key: string]: any,
}

export default ImageObject