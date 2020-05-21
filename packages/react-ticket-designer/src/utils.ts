import {modelObject} from './types';
import {CSSProperties} from 'react';

export const buildStyle = ({x, y, width: w, height: h, transform: t}: modelObject, {x: dx, y: dy, width: dw, height: dh, transform: dt}: any = {}): CSSProperties => ({
    position: 'absolute',
    left: undefined !== x ? x : (dx ? dx : 0),
    top: undefined !== y ? y : (dy ? dy : 0),
    width: undefined !== w ? w : (dw ? dw : 300),
    height: undefined !== h ? h : (dh ? dh : 300),
    transform: undefined !== t ? t : (dt ? dt : undefined),
});