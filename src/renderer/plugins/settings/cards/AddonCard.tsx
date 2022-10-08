import { React } from '@hykord/webpack';
import { Card, Checkbox, ErrorBoundary, Flex, Forms } from '@hykord/components';
import { plugins, togglePlugin } from '@loader/plugin';
import { themes, toggleTheme } from '@loader/theme';
import { Plugin, Theme } from '@hykord/structures';

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
    addon.toggleable = false;
    dispatcher(true);

    try {
      await action();
    } catch (e) {
      console.log(e);
      // TODO: Handle error
    } finally {
      addon.toggleable = true;
      dispatcher(false);
    }
  };
};

export default ErrorBoundary.wrap((props: Props) => {
  const addon: Plugin | Theme | undefined =
    props.type === 'plugin'
      ? plugins.find((p) => p.name === props.name)
      : themes.find((t) => t.name === props.name);

  if (!addon) return null;

  const [disabled, setDisabled] = React.useState(!addon!.toggleable!);
  const [checked, setChecked] = React.useState(addon!.$enabled!);

  if (
    props.type === 'plugin' &&
    plugins.find(p => p.dependsOn?.includes(addon!.name!))
  ) setDisabled(true);

  return (
    <Card
      className="hykord-card"
      type={Card.Types.PRIMARY}
      body={
        <>
          <Flex
            style={{
              justifyContent: 'space-between',
            }}
          >
            <Forms.FormText tag="h5">
              <strong>{addon?.name}</strong> by <strong>{addon?.author}</strong>
            </Forms.FormText>

            <Checkbox
              disabled={disabled}
              checked={checked}
              onChange={withDispatcher(setDisabled, addon, async () => {
                if (props.type === 'plugin') {
                  await togglePlugin(addon as Plugin);
                } else {
                  await toggleTheme(addon as Theme);
                }

                setChecked(addon!.$enabled!);
              })}
            />
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
