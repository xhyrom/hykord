import { React } from '@hykord/webpack'
import { Card, Checkbox, ErrorBoundary, Flex, Forms, Inputs } from '@hykord/components'
import { plugins } from '@loader/plugin';
import { themes } from '@loader/theme';

interface Props {
    type: 'plugin' | 'theme';
    name: string;
}

export default ErrorBoundary.wrap((props: Props) => {
    const addon = props.type === 'plugin' ? 
        plugins.find(p => p.name === props.name) :
        themes.find(t => t.name === props.name);

    return <Card
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

                    <Checkbox
                        disabled={!addon?.toggleable}
                        checked={true}
                        onChange={() => true}
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