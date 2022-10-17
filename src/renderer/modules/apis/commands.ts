import { APIApplicationCommandOption, ApplicationCommandType } from 'discord-api-types/v10';
import { Channel, Guild } from 'discord-types/general';
import { Awaitable } from '../../../common/types';
import { generateSnowflake } from '../../utils/discord';

export enum CommandInputType {
    BUILT_IN = 0,
    BUILT_IN_TEXT = 1,
    BUILT_IN_INTEGRATION = 2,
    BOT = 3,
    PLACEHOLDER = 4,
}

export type CommandOption = APIApplicationCommandOption & {
    displayName: string;
    displayDescription: string;
    options: CommandOption[];
}

export interface CommandContext {
    channel: Channel;
    guild?: Guild;
}

export interface Command {
    id?: string;
    applicationId?: string;
    type?: ApplicationCommandType;
    inputType?: CommandInputType;

    name: string;
    displayName?: string;
    description: string;
    displayDescription?: string;

    options: APIApplicationCommandOption[];
    predicate?(ctx: CommandContext): boolean;
    execute(args: APIApplicationCommandOption[], ctx: CommandContext): Awaitable<void | { content: string; cancel?: boolean; }>;
}

export let commands: Command[] = [];

export const _init = (cmds: any) => {
    commands = cmds;
    return cmds;
};

export const registerCommand = (command: Command) => {
    command.id ??= `-${generateSnowflake()}`;
    command.applicationId ??= '-1'; // BUILT_IN;
    command.type ??= ApplicationCommandType.ChatInput;
    command.inputType ??= CommandInputType.BUILT_IN_TEXT;

    command.displayName ||= command.name;
    command.displayDescription ||= command.description;

    commands.push(command);
}