import { React } from '@hykord/webpack';
import { Forms } from '@hykord/components';
import { ErrorBoundary } from '@hykord/components';
import AddonCard from './cards/AddonCard';
import { themes } from '@loader/theme';

export default ErrorBoundary.wrap(() => {
  const forceUpdate = React.useReducer((x) => x + 1, 0)[1];

  return (
    <Forms.FormSection tag="h1" title="Themes">
      <Forms.FormTitle>Here you can see installed themes</Forms.FormTitle>
      {themes.map((theme) => (
        <AddonCard name={theme.name} type={'theme'} forceUpdate={forceUpdate} />
      ))}
    </Forms.FormSection>
  );
});
