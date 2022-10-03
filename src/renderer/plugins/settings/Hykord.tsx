import { Forms, Inputs } from '@hykord/components';
import { React } from '@hykord/webpack';
import { ErrorBoundary } from '@hykord/components/ErrorBoundary';

export default ErrorBoundary.wrap(() => {
    console.log(Forms, Inputs);
    return <Forms.FormSection tag='h1' title='Hykord'>
        <Forms.FormTitle>Discord Options</Forms.FormTitle>
        <Forms.FormDivider />
        <Forms.FormTitle>Hykord Options</Forms.FormTitle>
        <Inputs.Switch
            value={HykordNative.getManagers().getSettings().getSync('hykord.unsafe-require')}
            note={'Allows you to require any installed module'}
            onChange={(value: boolean) => HykordNative.getManagers().getSettings().set('hykord.unsafe-require', value)}
            label='Enable HykordNative.require'
        />
    </Forms.FormSection>
})