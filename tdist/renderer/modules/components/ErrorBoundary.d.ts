/// <reference types="react" />
import { React } from '@hykord/webpack';
declare enum State {
    CRASHED = 0,
    NO_ERROR = 1
}
export declare class ErrorBoundary extends React.Component {
    static wrap<T = any>(Component: React.ComponentType<T>): (props?: T) => React.ReactElement;
    state: {
        state: State;
        message: string;
    };
    static getDerivedStateFromError(error: any): {
        state: State;
        message: any;
    };
    componentDidCatch(error: any, errorInfo: any): void;
    render(): import("react").ReactNode;
}
export {};
