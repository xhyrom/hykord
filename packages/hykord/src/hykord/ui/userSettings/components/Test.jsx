import { React } from '@module/webpack';
import { Button, FormNotice, FormDivider, ErrorBoundary } from '@module/components';

export default async() => {
    return () => {
        return (
            <ErrorBoundary>
                <FormNotice
                    type={FormNotice.Types.DANGER}
                    title='Experiments ahead!'
                    body={<>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tellus integer feugiat scelerisque varius morbi enim nunc faucibus. Feugiat in fermentum posuere urna nec.</>}
                />
                <FormDivider className="hykord-form-divider" />
                <Button
                    color={Button.Colors.RED}
                    size={Button.Sizes.LARGE}
                    look={Button.Looks.OUTLINED}
                    onClick={() => this.setState({ ...this.state, crashed: false })}
                > 
                    Retry
                </Button>
            </ErrorBoundary>
        )
    }
}