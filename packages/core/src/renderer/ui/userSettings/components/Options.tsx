import { React } from "@hykord/webpack";
import { Boolean } from '@hykord/components/inputs';
import { FormTitle, FormItem, ErrorBoundary } from '@hykord/components';
import { openConfirmationModal, openRequiredRestartModal } from '@hykord/utilities/modals';

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
                        toggle={() => {
                            return new Promise((resolve) => {
                                if (settings.getSetting('hykord.bypass_security_check_require')) return resolve(settings.toggleSetting("hykord.bypass_security_check_require"));

                                openConfirmationModal(
                                    {
                                        header: 'Additional Info',
                                        confirmText: 'Accept',
                                        cancelText: 'Cancel',
                                        content: 'When you enable this setting, you will be able to import all packages (also nodejs pkgs) in Electron Isolated Content. Plugins can import all packages regardless of this setting. This setting is only for your security.',
                                        type: 'warn'
                                    },
                                    (accepted) => {
                                        if (accepted) resolve(settings.toggleSetting("hykord.bypass_security_check_require"));
                                        else resolve(false);
                                    }
                                )
                            })
                        }}
                        note="Bypass security check require in window.require - plugins already have access to all modules"
                        value={settings.getSetting("hykord.bypass_security_check_require", false)}
                        label="Bypass Security Check Require"
                    />
                    <Boolean
                        toggle={() => settings.toggleSetting("hykord.enable_dev_experiment_mod")}
                        note="Enable experiment hykord development mod"
                        value={settings.getSetting("hykord.enable_dev_experiment_mod", false)}
                        label="Hykord Dev Mod"
                        postHandle={() => openRequiredRestartModal()}
                    />
                </FormItem>
            </ErrorBoundary>
        )
    }
}