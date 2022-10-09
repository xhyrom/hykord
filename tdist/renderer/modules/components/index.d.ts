/// <reference types="react" />
import type Components from 'discord-types/components';
export declare const Forms: {
    FormTitle: Components.FormTitle;
    FormSection: any;
    FormDivider: any;
    FormText: Components.FormText;
};
export declare let Card: Components.Card;
export declare let Button: any;
export declare let Switch: any;
export declare let Checkbox: any;
export declare let Tooltip: Components.Tooltip;
export declare let Alerts: {
    show(alert: {
        title: any;
        body?: React.ReactNode;
        className?: string;
        confirmColor?: string;
        cancelText?: string;
        confirmText?: string;
        secondaryConfirmText?: string;
        onCancel?(): void;
        onConfirm?(): void;
        onConfirmSecondary?(): void;
    }): void;
    close(): void;
};
declare enum ToastType {
    MESSAGE = 0,
    SUCCESS = 1,
    FAILURE = 2,
    CUSTOM = 3
}
declare enum ToastPosition {
    TOP = 0,
    BOTTOM = 1
}
export declare const Toasts: {
    show(data: {
        message: string;
        id: string;
        type: ToastType;
        options?: {
            position?: ToastPosition;
            component?: React.ReactNode;
            duration?: number;
        };
    }): void;
    pop(): void;
    Type: typeof ToastType;
    Position: typeof ToastPosition;
    genId: () => string;
};
export declare const Inputs: {
    Switch: typeof import('./inputs/Switch').Switch;
};
export declare let Flex: typeof import('./Flex').Flex;
export declare let ErrorBoundary: typeof import('./ErrorBoundary').ErrorBoundary;
export declare let Link: typeof import('./Link').Link;
export {};
