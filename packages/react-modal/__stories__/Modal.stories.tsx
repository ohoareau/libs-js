import React from 'react';
import Modal from '../src/Modal';

export default {
    title: 'Modal',
    component: Modal,
}

export const basic = () => <Modal name={'the-modal'} submitLabel={'Submit'} onSubmit={() => {}} onCancel={() => {}} cancelLabel={'Cancel'}>This is the content of the modal</Modal>;
export const fullScreen = () => <Modal mode={'fullscreen'} name={'the-modal'} submitLabel={'Submit'} onSubmit={() => {}}>This is the content of the modal</Modal>;
export const fullScreenNoTitle = () => <Modal noTitle mode={'fullscreen'} name={'the-modal'} submitLabel={'Submit'} onSubmit={() => {}}>This is the content of the modal</Modal>;
