import { React } from '@hykord/webpack';
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
import { plugins, togglePlugin } from '@loader/plugin';
import { themes, toggleTheme } from '@loader/theme';
import { Plugin, PluginSetting, Theme } from '@hykord/structures';

interface Props {
  type: 'plugin' | 'theme';
  name: string;
}

const withDispatcher = (
  dispatcher: React.Dispatch<React.SetStateAction<boolean>>,
  addon: Plugin | Theme,
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

const Settings = (props: { settings: PluginSetting[]; addon: Plugin }) => {
  return (
    <div
      style={{
        display: 'inline',
        textAlign: 'left',
      }}
    >
      {props.settings.map((setting) => (
        <Inputs.Switch
          value={props.addon.getSettingSync<boolean>(setting.name, setting.defaultValue)}
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
  const addon: Plugin | Theme | undefined =
    props.type === 'plugin'
      ? plugins.find((p) => p.name === props.name)
      : themes.find((t) => t.name === props.name);

  if (!addon) return null;

  const [disabled, setDisabled] = React.useState(!addon!.$toggleable!);
  const [checked, setChecked] = React.useState(addon!.$enabled!);

  if (
    props.type === 'plugin' &&
    plugins.find((p) => p.dependsOn?.includes(addon!.name!))
  )
    setDisabled(true);

  return (
    <Card
      className='hykord-card'
      type={Card.Types.PRIMARY}
      body={
        <>
          <Flex
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div className='hykord-card-header'>
              <Forms.FormText tag='h5'>
                <strong>{addon?.name}</strong> by{' '}
                <strong>{addon?.author}</strong>
              </Forms.FormText>
            </div>

            <div className='hykord-card-right'>
              <div className='hykord-card-buttons'>
                {(addon as Plugin).settings && (
                  <Tooltip
                    position={Tooltip.Positions.RIGHT}
                    text='Open Settings'
                    align='center'
                  >
                    {(tooltipProps: any) => (
                      <svg
                        {...tooltipProps}
                        onClick={() => {
                          Alerts.show({
                            title: `Settings for ${addon!.name}`,
                            body: (
                              <Settings
                                settings={(addon as Plugin)!.settings!}
                                addon={addon as Plugin}
                              />
                            ),
                            confirmText: '',
                          });
                        }}
                        style={{
                          width: '24px',
                          fill: 'var(--interactive-normal)',
                          marginLeft: 'auto',
                        }}
                        viewBox='0 0 24 24'
                      >
                        <path d='M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z' />
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
                    await togglePlugin(addon as Plugin);
                  } else {
                    await toggleTheme(addon as Theme);
                  }

                  await HykordNative.getManagers().getSettings().addValue(`enabled-${props.type}s`, addon!.$cleanName!);
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
