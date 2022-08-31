import 'module-alias/register';
import { React } from "@module/webpack";
import { Boolean } from "@module/components/inputs/Boolean";
import { titleCase } from '@dependency/titlecase';

export default (props) => {
    const settings = window.hykord.settings;
    const settingKey = props.settingKey;
    const label = titleCase(settingKey.replaceAll('.', ' ').replaceAll('_', ' '));

    const setting = settings.getSetting(settingKey);

    return (
        <Boolean settingName={settingKey} setting={setting} label={label} />
    )
}