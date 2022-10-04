import { Forms, Inputs } from '@hykord/components';
import { React } from '@hykord/webpack';
import { ErrorBoundary } from '@hykord/components/ErrorBoundary';

export default ErrorBoundary.wrap(() => {
    return (
        <>
        <Forms.FormSection tag='h1' title='Hykord'>
            <Forms.FormSection>
                <Forms.FormTitle>Options</Forms.FormTitle>
                {/* // TODO: ADD REQUIRE RESTART MODAL */}
                <Inputs.Switch
                    value={HykordNative.getManagers().getSettings().getSync('hykord.disable-science-requests', false)}
                    note={'Disable discord\'s science requests and tracking'}
                    onChange={(value: boolean) => HykordNative.getManagers().getSettings().set('hykord.disable-science-requests', value)}
                    label='Disable science requests'
                />
                <Inputs.Switch
                    value={HykordNative.getManagers().getSettings().getSync('hykord.unsafe-require', false)}
                    note={'Allows you to require any installed module'}
                    onChange={(value: boolean) => HykordNative.getManagers().getSettings().set('hykord.unsafe-require', value)}
                    label='Enable unsafe require'
                />
            </Forms.FormSection>
        </Forms.FormSection>
        </>
    );
})