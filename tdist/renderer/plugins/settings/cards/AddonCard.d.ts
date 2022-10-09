/// <reference types="react" />
interface Props {
    type: 'plugin' | 'theme';
    name: string;
    forceUpdate: React.DispatchWithoutAction;
}
declare const _default: (props?: Props | undefined) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
export default _default;
