import { React } from '@hykord/webpack';
import { Forms, TextInput } from '@hykord/components';
import { ErrorBoundary } from '@hykord/components';
import AddonCard from './cards/AddonCard';
import type { Addon } from '@hykord/hooks';
import { BetterSet } from '../@hykord/utils';

interface Props {
  addons: BetterSet<Addon>;
  type: 'plugin' | 'theme';
  placeholder: string;
  title: string;
}

export default ErrorBoundary.wrap((props: Props) => {
  const { addons, type, placeholder, title } = props;

  const forceUpdate = React.useReducer((x) => x + 1, 0)[1];
  const [input, setInput] = React.useState('');

  const allAddons: Addon[] =
    input === ''
      ? [...addons]
      : addons.filter((addon) =>
          addon.name.toLowerCase().includes(input.toLowerCase()),
        );

  return (
    <Forms.FormSection tag="h1" title="Plugins">
      <Forms.FormTitle>{title}</Forms.FormTitle>
      <TextInput
        value={input}
        placeholder={placeholder}
        onChange={setInput}
        style={{ marginBottom: 24 }}
      />
      {allAddons.map((addon) => (
        <AddonCard name={addon.name} type={type} forceUpdate={forceUpdate} />
      ))}
    </Forms.FormSection>
  );
});
