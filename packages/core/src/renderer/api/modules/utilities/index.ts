import { registerPluginSection, unregisterPluginSection } from "@api/ui/userSettingsHykord"

export * as modals from './modals';
export * as loaders from './loaders';

export const registerSection = registerPluginSection;
export const unregisterSection = unregisterPluginSection;

export const linkify = (text: string) => {
    return text.replace(/(((https?:\/\/)|(www\.))[^\s]+)/g, (url) => '<a href="' + url + '">' + url + '</a>');
}

export const nameToId = (text: string): string => {
    return text.replaceAll(' ', '-').toLowerCase();
}