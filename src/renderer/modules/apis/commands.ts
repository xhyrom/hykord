export let BUILT_IN = [];

export const _init = (cmds: any) => {
    BUILT_IN = cmds;
    console.log(BUILT_IN);
    return cmds;
};