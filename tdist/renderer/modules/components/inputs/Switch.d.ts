/// <reference types="react" />
import { React } from '@hykord/webpack';
interface Props {
    disabled?: boolean;
    value: boolean;
    onChange: (value: boolean) => boolean | Promise<boolean>;
    note: string;
    label: string;
}
export declare class Switch extends React.Component<Props> {
    constructor(props: Props);
    state: {
        value: boolean;
    };
    handleChange(): Promise<void>;
    render(): JSX.Element;
}
export {};
