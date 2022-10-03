import { Forms } from '@hykord/components';
import { React } from '@hykord/webpack';
import { ErrorBoundary } from '@hykord/components/ErrorBoundary';

export default ErrorBoundary.wrap(() => {
    return <Forms.FormSection tag='h1' title='Themes'>
        <Forms.FormTitle>asd</Forms.FormTitle>
        <h1>Nice</h1>
    </Forms.FormSection>
})