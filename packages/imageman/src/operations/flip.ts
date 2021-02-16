import {flip_operation} from '../types';

export default async function operate(img, {direction}: flip_operation) {
    img[direction === 'vertical'? 'flip' : 'flop']();
}