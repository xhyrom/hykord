import { React } from '@hykord/webpack';
import { Forms } from '@hykord/components';
import { ErrorBoundary } from '@hykord/components';
import { plugins } from '@loader/plugin';
import AddonCard from './cards/AddonCard';

export default ErrorBoundary.wrap(() => {
  const forceUpdate = React.useReducer((x) => x + 1, 0)[1];

  return (
    <Forms.FormSection tag="h1" title="Plugins">
      <Forms.FormTitle>Here you can see installed plugins</Forms.FormTitle>
      {plugins.map((plugin) => (
        <AddonCard
          name={plugin.name}
          type={'plugin'}
          forceUpdate={forceUpdate}
        />
      ))}
    </Forms.FormSection>
  );
});
