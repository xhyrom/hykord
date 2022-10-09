export declare let sections: {
    priority: number;
    section: string;
    label: string;
    element: any;
}[];
export declare const registerSection: (id: string, name: string, component: any, priority?: number) => () => void;
export declare const unregisterSection: (id: string) => void;
