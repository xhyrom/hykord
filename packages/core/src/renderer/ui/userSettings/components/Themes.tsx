import { React } from "@hykord/webpack";
import ThemeCard from './cards/ThemeCard';
import { shell } from 'electron';
import { FormTitle, FormSection, ErrorBoundary, FormLabel, Button, FormDivider, Flex } from '@hykord/components';
import { Search } from '@hykord/components/other';
import { Theme } from '@hykord/structures';
import { nameToId } from "@hykord/utilities";

export default async() => {
    const themes = window.hykord.themes;

    return () => {
        const [input, setInput] = React.useState('');

        const allThemes: Theme[] = input === ''
            ? themes.getAllThemes()
            : themes.getAllThemes().filter(theme => theme.name.includes(input));

        return (
            <ErrorBoundary>
                <FormSection>
                    <FormTitle tag="h1">Themes</FormTitle>
                    <FormLabel>Here you can see installed themes</FormLabel>
                    <Flex justify={Flex.Justify.CENTER} align={Flex.Align.CENTER} wrap={Flex.Wrap.NOWRAP}>
                        <Search
                            containerStyle={{ marginRight: "20px" }}
                            placeholder='Search theme by name'
                            type='text'
                            value={input}
                            onChange={setInput}
                        />
                        <Button
                            style={{ marginRight: "20px" }}
                            color={Button.Colors.BRAND_NEW}
                            size={Button.Sizes.MEDIUM}
                            look={Button.Looks.FILLED}
                            onClick={() => shell.openPath(themes.location)}
                        >
                            Open Themes Folder
                        </Button>
                        <Button
                            color={Button.Colors.PRIMARY}
                            size={Button.Sizes.MEDIUM}
                            look={Button.Looks.FILLED}
                            onClick={() => window.hykord.themes.loadThemes()}
                        >
                            Reload
                        </Button>
                    </Flex>
                    <FormDivider className='hykord-form-divider' />
                    {allThemes.map(theme => (
                        <ThemeCard key={nameToId(theme.name)} themeName={theme.name} />
                    ))}
                </FormSection>
            </ErrorBoundary>
        )
    }
}