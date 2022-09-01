import 'module-alias/register';
import { findByDisplayName, findAsync, React } from "@module/webpack";
import { Boolean } from '@module/components/inputs';
import { ErrorBoundary } from '@hykord/api/modules/components/ErrorBoundary';

const FormTitle = findByDisplayName("FormTitle");

export default async() => {
    const FormSection = await findAsync(() => findByDisplayName("FormSection"));

    return () => {
        const settings = window.hykord.settings;

        return (
            <ErrorBoundary>
                <FormSection>
                    <FormTitle tag="h1">Options</FormTitle>
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
                </FormSection>
            </ErrorBoundary>
        )
    }
}