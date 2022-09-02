import 'module-alias/register';
import { React } from "@module/webpack";
import ThemeCard from './cards/ThemeCard';
import { FormTitle, FormSection, ErrorBoundary, FormLabel } from '@module/components';

export default async() => {
    const themes = window.hykord.themes;

    return () => {
        return (
            <ErrorBoundary>
                <FormSection>
                    <FormTitle tag="h1">Themes</FormTitle>
                    <FormLabel>Here you can see installed themes</FormLabel>
                    {themes.getAllThemes().map(theme => (
                        <ThemeCard themeName={theme.name} />
                    ))}
                </FormSection>
            </ErrorBoundary>
        )
    }
}