import {
  Alerts,
  Card,
  Checkbox,
  ErrorBoundary,
  Flex,
  Forms,
  Inputs,
  Tooltip,
} from '@hykord/components';
import { React } from '@hykord/webpack';
import {
  plugins,
  togglePlugin,
  disablePlugin,
  directory as pluginDirectory,
  removePlugin,
} from '@loader/plugin';
import {
  themes,
  toggleTheme,
  disableTheme,
  directory as themeDirectory,
  removeTheme,
} from '@loader/theme';
import {
  type Addon,
  PluginInfo,
  PluginSetting,
  ThemeInfo,
} from '@hykord/hooks';
const { join } = window.require<typeof import('path')>('path');
const { rm } =
  window.require<typeof import('../../../../preload/polyfill/fs/promises')>(
    'fs/promises',
  );

interface Props {
  type: 'plugin' | 'theme';
  name: string;
  forceUpdate: React.DispatchWithoutAction;
}

const withDispatcher = (
  dispatcher: React.Dispatch<React.SetStateAction<boolean>>,
  addon: PluginInfo | ThemeInfo,
  action: () => any,
) => {
  return async () => {
    addon.$toggleable = false;
    dispatcher(true);

    try {
      await action();
    } catch (e) {
      console.log(e);
      // TODO: Handle error
    } finally {
      addon.$toggleable = true;
      dispatcher(false);
    }
  };
};

const Settings = (props: { settings: PluginSetting[]; addon: PluginInfo }) => {
  return (
    <div
      style={{
        display: 'inline',
        textAlign: 'left',
      }}
    >
      {props.settings.map((setting) => (
        <Inputs.Switch
          value={Hykord.Settings.getSync<boolean>(
            `plugins.${props.addon.$cleanName}.${setting.name}`,
            setting.defaultValue,
          )}
          note={setting.description}
          onChange={(value: boolean) =>
            HykordNative.getManagers()
              .getSettings()
              .set(`plugins.${props.addon.$cleanName}.${setting.name}`, value)
          }
          label={setting.name}
        />
      ))}
    </div>
  );
};

export default ErrorBoundary.wrap((props: Props) => {
  const addon: Addon | undefined =
    props.type === 'plugin'
      ? plugins.find((p) => p.name === props.name)
      : themes.find((t) => t.name === props.name);

  if (!addon) return null;

  const [disabled, setDisabled] = React.useState(
    props.type === 'plugin'
      ? plugins.find((p) => p.dependsOn?.includes(addon!.name!))
        ? true
        : !addon!.$toggleable!
      : !addon!.$toggleable!,
  );

  const [checked, setChecked] = React.useState(addon!.$enabled!);

  return (
    <Card
      className="hykord-card"
      type={Card.Types.PRIMARY}
      body={
        <>
          <Flex
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div className="hykord-card-header">
              <Forms.FormText tag="h5">
                <strong>{addon?.name}</strong> by{' '}
                <strong>{addon?.author}</strong>
              </Forms.FormText>
            </div>

            <div className="hykord-card-right">
              <div className="hykord-card-buttons">
                {(addon as PluginInfo).settings && (
                  <Tooltip
                    position={Tooltip.Positions.RIGHT}
                    text="Open Settings"
                    align="center"
                  >
                    {(tooltipProps: any) => (
                      <svg
                        {...tooltipProps}
                        onClick={() => {
                          Alerts.show({
                            title: `Settings for ${addon!.name}`,
                            body: (
                              <Settings
                                settings={(addon as PluginInfo)!.settings!}
                                addon={addon as PluginInfo}
                              />
                            ),
                            confirmText: '',
                          });
                        }}
                        className="hykord-tooltip"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                      </svg>
                    )}
                  </Tooltip>
                )}

                {!addon.$internal && (
                  <Tooltip
                    position={Tooltip.Positions.RIGHT}
                    text="Delete"
                    align="center"
                  >
                    {(tooltipProps: any) => (
                      <svg
                        {...tooltipProps}
                        onClick={() => {
                          Alerts.show({
                            title: `Delete ${addon!.name}`,
                            body: `Are you sure you want to delete ${
                              addon!.name
                            }?`,
                            confirmText: 'Delete',
                            onConfirm: async () => {
                              HykordNative.getManagers()
                                .getSettings()
                                .delete(`plugins.${addon!.$cleanName}`);
                              if (props.type === 'plugin') {
                                await disablePlugin(addon as PluginInfo);
                                await removePlugin(addon as PluginInfo);
                                rm(join(pluginDirectory, addon!.$fileName!));
                              } else {
                                await disableTheme(addon as ThemeInfo);
                                await removeTheme(addon as ThemeInfo);
                                rm(join(themeDirectory, addon!.$fileName!));
                              }

                              props.forceUpdate();
                            },
                          });
                        }}
                        className="hykord-tooltip"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z" />
                      </svg>
                    )}
                  </Tooltip>
                )}
              </div>

              <Checkbox
                disabled={disabled}
                checked={checked}
                onChange={withDispatcher(setDisabled, addon, async () => {
                  if (props.type === 'plugin') {
                    await togglePlugin(addon as PluginInfo);
                  } else {
                    await toggleTheme(addon as ThemeInfo);
                  }

                  if (addon!.$enabled) {
                    await HykordNative.getManagers()
                      .getSettings()
                      .addValue(
                        `hykord.enabled.${props.type}s`,
                        addon!.$cleanName!,
                      );
                  } else {
                    await HykordNative.getManagers()
                      .getSettings()
                      .removeValue(
                        `hykord.enabled.${props.type}s`,
                        addon!.$cleanName!,
                      );
                  }

                  setChecked(addon!.$enabled!);
                })}
              />
            </div>
          </Flex>

          <Forms.FormText>{addon?.description}</Forms.FormText>
          <br />
          <Forms.FormText>Version: {addon?.version || '?.?.?'}</Forms.FormText>
          <Forms.FormText>License: {addon?.license || '???'}</Forms.FormText>
        </>
      }
    />
  );
});
