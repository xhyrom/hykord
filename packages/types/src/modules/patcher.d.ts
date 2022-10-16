declare module '@hykord/patcher' {
    export const patchCss: (content: string, id?: string) => void;
    export const unpatchCss: (id?: string) => void;
}