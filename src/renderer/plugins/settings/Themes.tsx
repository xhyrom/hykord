import { React } from '@hykord/webpack';
import { Button, Forms } from '@hykord/components';
import { ErrorBoundary } from '@hykord/components';
import AddonCard from './cards/AddonCard';
import { themes, loadThemes } from '@loader/theme';

export default ErrorBoundary.wrap(() => {
  const forceUpdate = React.useReducer((x) => x + 1, 0)[1];

  return (
    <Forms.FormSection tag="h1" title="Themes">
      <Forms.FormTitle>Here you can see installed themes</Forms.FormTitle>
      <Button
        color={Button.Colors.BRAND_NEW}
        size={Button.Sizes.TINY}
        look={Button.Looks.FILLED}
        onClick={async () => {
          await loadThemes();
          forceUpdate();
        }}
      >
        Reload
      </Button>
      <br />
      {themes.map((theme) => (
        <AddonCard name={theme.name} type={'theme'} forceUpdate={forceUpdate} />
      ))}
    </Forms.FormSection>
  );
});
