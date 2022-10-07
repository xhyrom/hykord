import { React } from '@hykord/webpack'
import { Card, Inputs, ErrorBoundary, Flex, Forms } from '@hykord/components'
import { plugins, togglePlugin } from '@loader/plugin';
import { themes, toggleTheme } from '@loader/theme';
import { Plugin, Theme } from '@hykord/structures';

interface Props {
    type: 'plugin' | 'theme';
    name: string;
}

export default ErrorBoundary.wrap((props: Props) => {
    const addon = props.type === 'plugin' ? 
        plugins.find(p => p.name === props.name) :
        themes.find(t => t.name === props.name);

    return <Card
        className='hykord-card'
        type={Card.Types.PRIMARY}
        body={
            <>
                <Flex style={
                    {
                        'justifyContent': 'space-between' 
                    }
                }>
                    <Forms.FormText tag='h5'>
                        <strong>{addon?.name}</strong> by <strong>{addon?.author}</strong>
                    </Forms.FormText>

                    <Inputs.Checkbox
                        disabled={!addon!.toggleable}
                        checked={addon!.$enabled!}
                        onChange={() => {
                            if (props.type === 'plugin') {
                                togglePlugin(addon as Plugin);
                            } else {
                                toggleTheme(addon as Theme);
                            }

                            return addon!.$enabled!;
                        }}
                    />
                </Flex>

                <Forms.FormText>
                    {addon?.description}
                </Forms.FormText>
                <br />
                <Forms.FormText>Version: {addon?.version || '?.?.?'}</Forms.FormText>
                <Forms.FormText>License: {addon?.license || '???'}</Forms.FormText>
            </>
        }
    />;
})