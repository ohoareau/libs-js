import React from 'react';
import ErrorBoundary from '../src/ErrorBoundary';

export default {
    title: 'ErrorBoundary',
    component: ErrorBoundary,
}

const FailingComponent = () => {
    throw new Error('This is an unexpected error');
};

export const basic = () => (
    <ErrorBoundary>
        <FailingComponent />
    </ErrorBoundary>
);