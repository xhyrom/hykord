// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck - too many issuess
// Some components from https://github.com/Vendicated/Vencord/blob/main/src/webpack/common.tsx

import type Components from 'discord-types/components';
import { Filters, waitForSync } from '@hykord/webpack';
import { generateSnowflake } from '@hykord/utils/discord';

export * as Styles from './styles';
export const Forms = {} as {
    FormTitle: Components.FormTitle;
    FormSection: any;
    FormDivider: any;
    FormText: Components.FormText;
};

export let Card: Components.Card;
export let Button: any;
export let Switch: any;
export let Checkbox: any
export let Tooltip: Components.Tooltip;
export let TextInput: Components.TextInput;
export let Text: any;

// Alerts
export let Alerts: {
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

// Toasts
enum ToastType {
    MESSAGE,
    SUCCESS,
    FAILURE,
    CUSTOM,
};

enum ToastPosition {
    TOP,
    BOTTOM,
};

export const Toasts = {
    Type: ToastType,
    Position: ToastPosition,
    genId: () => (Math.random() || Math.random()).toString(36).slice(2),

    ...{} as {
        show(data: {
            message: string,
            id: string,
            type: ToastType,
            options?: {
                position?: ToastPosition;
                component?: React.ReactNode,
                duration?: number;
            };
        }): void;
        pop(): void;
    }
};

// Modals
enum ModalTransitionState {
    ENTERING,
    ENTERED,
    EXITING,
    EXITED,
    HIDDEN,
}

export const Modals = {
    ModalSize: {
        SMALL: 'small',
        MEDIUM: 'medium',
        LARGE: 'large',
        DYNAMIC: 'dynamic',
    }
} as {
    openModal(component: React.ComponentType);
    openModal(component: React.ComponentType, key: string);
    openModal(component: React.ComponentType, modalProps: Record<string, any>);
    openModal(component: React.ComponentType, modalProps: Record<string, any>, key: string);
    closeModal(key: string);
    ModalRoot: (props: {
        transitionState: ModalTransitionState;
        children: React.ReactNode;
        size?: ModalSize;
        role?: 'alertdialog' | 'dialog';
        className?: string;
        onAnimationEnd?(): string;
    }) => Components.Component<'ModalRoot'>;
} & Components.Modal;

// Custom components:
export const Inputs = {} as {
    Switch: typeof import('./inputs/Switch').Switch;
}

export let Flex: typeof import('./Flex').Flex;
export let ErrorBoundary: typeof import('./ErrorBoundary').ErrorBoundary;
export let Link: typeof import('./Link').Link;

waitForSync('useState', () => {
    ErrorBoundary = require('./ErrorBoundary').ErrorBoundary;
    Flex = require('./Flex').Flex;
    Link = require('./Link').Link;
});

waitForSync(m => m.Tags && Filters.byCode('errorSeparator')(m), m => Forms.FormTitle = m);
waitForSync(m => m.Tags && Filters.byCode('titleClassName', 'sectionTitle')(m), m => Forms.FormSection = m);
waitForSync(m => m.Types?.INPUT_PLACEHOLDER, m => Forms.FormText = m);
waitForSync(Filters.byCode('().divider', 'style'), m => Forms.FormDivider = m, 1);

waitForSync(['Hovers', 'Looks', 'Sizes'], m => Button = m);
waitForSync(Filters.byCode('helpdeskArticleId'), m => {
    Switch = m;
    Inputs.Switch = require('./inputs/Switch').Switch;
});

waitForSync(Filters.byCode('input', 'createElement', 'checkbox'), m => Checkbox = m);

waitForSync(['Positions', 'Colors'], m => Tooltip = m);
waitForSync(['defaultProps', 'Sizes', 'contextType'], m => TextInput = m);
waitForSync(m => {
    if (typeof m !== 'function') return false;
    const s = m.toString();
    return (s.length < 1500 && s.includes('data-text-variant') && s.includes('always-white'));
}, m => Text = m);

waitForSync(m => m.Types?.PRIMARY === 'cardPrimary', m => Card = m);

// Alerts
waitForSync(['show', 'close'], m => Alerts = m);

// Toasts
waitForSync(Filters.byCode('currentToast?'), m => Toasts.show = m);
waitForSync(Filters.byCode('currentToast:null'), m => Toasts.pop = m);

// Modals
waitForSync(Filters.byCode('onCloseRequest:null!='), m => {
    Modals.openModal = (Component, modalProps, key) => {
        if (typeof modalProps === 'string') {
            key = modalProps;
            modalProps = {};
        }

        key ??= generateSnowflake();

        m(props => (
            <Modals.ModalRoot {...props} {...modalProps}>
                <Component />
            </Modals.ModalRoot>
        ), { modalKey: key });

        return key;
    }
});

waitForSync(Filters.byCode('onCloseCallback&&'), m => Modals.closeModal = m);
waitForSync(Filters.byCode('headerIdIsManaged:'), m => Modals.ModalRoot = m);
waitForSync(Filters.byCode('children', 'separator', 'wrap', 'NO_WRAP', 'grow', 'shrink', 'id', 'header'), m => Modals.ModalHeader = m);
waitForSync(Filters.byCode('scrollerRef', 'content', 'className', 'children'), m => Modals.ModalContent = m);
waitForSync(Filters.byCode('HORIZONTAL_REVERSE', 'START', 'STRETCH', 'NO_WRAP', 'footerSeparator'), m => Modals.ModalFooter = m);
waitForSync(Filters.byCode('closeWithCircleBackground', 'hideOnFullscreen'), m => Modals.ModalCloseButton = m);