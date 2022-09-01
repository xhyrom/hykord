import 'module-alias/register';
import { React } from "@module/webpack";
import { Boolean } from '@module/components/inputs';
import { FormTitle, FormItem, ErrorBoundary } from '@module/components';

export default async() => {
    const settings = window.hykord.settings;

    return () => {
        return (
            <ErrorBoundary>
                <FormTitle tag="h1">Options</FormTitle>
                <FormItem title={"Discord Options"} noteHasMargin>
                    <Boolean
                        toggle={() => settings.toggleSetting("discord.experiments")}
                        note="Enable discord experiments"
                        value={settings.getSetting("discord.experiments", false)}
                        label="Discord Experiments"
                        postHandle={() => settings.postHandle("discord.experiments")}
                    />
                    <Boolean
                        toggle={() => settings.toggleSetting("discord.allow_nsfw_and_bypass_age_requirement")}
                        note="Allow Not Safe For Work (NSFW) channels (also bypass age requirement)"
                        value={settings.getSetting("discord.allow_nsfw_and_bypass_age_requirement", false)}
                        label="Enable NSFW channels"
                        postHandle={() => settings.postHandle("discord.allow_nsfw_and_bypass_age_requirement")}
                    />
                </FormItem>
                <FormItem title={"Hykord Options"} noteHasMargin>
                    <Boolean
                        toggle={() => settings.toggleSetting("hykord.enable_dev_experiment_mod")}
                        note="Enable experiment hykord development mod"
                        value={settings.getSetting("hykord.enable_dev_experiment_mod", false)}
                        label="Hykord Dev Mod"
                        postHandle={() => settings.postHandle("hykord.enable_dev_experiment_mod")}
                    />
                </FormItem>
            </ErrorBoundary>
        )
    }
}