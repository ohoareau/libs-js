import React from 'react';
import Modal from '../src/Modal';

export default {
    title: 'Modal',
    component: Modal,
}

export const basic = () => <Modal name={'the-modal'}>This is the content of the modal</Modal>;