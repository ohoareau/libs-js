import React, {Component} from 'react';

export default class ErrorBoundary extends Component<ErrorBoundaryProps> {
    state: {hasError: boolean, message?: string, stackTrace?: any};
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {hasError: false, message: undefined, stackTrace: undefined};
    }
    // noinspection JSUnusedGlobalSymbols
    static getDerivedStateFromError(error) {
        return {hasError: true, message: error ? error.message : undefined, stackTrace: error ? error.stack : undefined};
    }
    componentDidCatch(error, errorInfo) {
    }
    render() {
        if (this.state.hasError) {
            if (this.props.mode === 'light') return (<div>Error: {this.state.message}</div>);
            return (
                <div style={{margin: 30}}>
                    <h1>Something went wrong :-(</h1>
                    <h3 style={{color: 'red'}}>An unexpected error occured. Please copy the following content
                        and send it to your administrators contact with some explanation on the action you were
                        doing. We apologize for the inconvenience.</h3>
                    <div style={{
                        border: '1px solid #DDDDDD',
                        borderRadius: 3,
                        padding: 10,
                        backgroundColor: '#EFEFEF',
                        marginBottom: 20
                    }}>
                        <pre style={{whiteSpace: 'pre-wrap'}}>{JSON.stringify(this.props.metadata)}</pre>
                    </div>
                    <div style={{
                        border: '1px solid #DDDDDD',
                        borderRadius: 3,
                        padding: 10,
                        backgroundColor: '#EFEFEF'
                    }}>
                        <pre style={{whiteSpace: 'pre-wrap'}}>{this.state.stackTrace}</pre>
                    </div>
                </div>
            );
        }
        return 'function' === typeof this.props.children ? this.props.children() : this.props.children;
    }
}

export interface ErrorBoundaryProps {
    mode?: string,
    metadata?: any,
}