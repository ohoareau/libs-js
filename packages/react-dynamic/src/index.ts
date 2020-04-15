import {register} from '@ohoareau/react-moduled';

register('component', path => import(/* webpackExclude: /\.d\.tsx?(\.map)?$/ */`./${path}`), 'base');

export {default as Form} from './Form';
export {default as FormField} from './FormField';
export {default as ModuleTypePanel} from './ModuleTypePanel';
export {default as ModuleTypeActionModal} from './ModuleTypeActionModal';
export {default as ModuleTypeActionFormWrapper} from './ModuleTypeActionFormWrapper';
export * from './hooks';