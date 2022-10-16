export let BUILT_IN = [];

export const _init = function (cmds: any) {
    try {
        BUILT_IN = cmds;
        console.log(BUILT_IN);
        //OptionalMessageOption = cmds.find(c => c.name === "shrug")!.options![0];
        //RequiredMessageOption = cmds.find(c => c.name === "me")!.options![0];
    } catch (e) {
        //console.error("Failed to load CommandsApi");
    }
    return cmds;
} as never;