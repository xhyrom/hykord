import 'module-alias/register';
import { findByDisplayName, findAsync, React } from "@module/webpack";
import Setting from './Setting';

const FormTitle = findByDisplayName("FormTitle");

export default async() => {
    const FormSection = await findAsync(() => findByDisplayName("FormSection"));

    return () => {
        const settings = window.hykord.settings;

        return ( 
            <FormSection>
                <FormTitle tag="h1">Options</FormTitle>
                {Array.from(settings.getAllSettings().keys()).map((settingKey) => {
                    return (
                        <Setting settingKey={settingKey} />
                    )
                })}
            </FormSection>
        )
    }
}