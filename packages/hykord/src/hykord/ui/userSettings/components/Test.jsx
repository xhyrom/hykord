import { React } from '@module/webpack';
import { Button, FormNotice, FormDivider, ErrorBoundary } from '@module/components';
import { openConfirmationModal } from '@module/utilities/modals';

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
                    size={Button.Sizes.SMALL}
                    look={Button.Looks.OUTLINED}
                    onClick={() => openConfirmationModal(
                        {
                            header: 'This is modal test',
                            content: 'We are wumpuses.',
                            type: 'danger',
                            confirmText: 'THIS IS NOT WUMPUS!!!',
                            cancelText: 'uWUntu'
                        },
                        (value) => {
                            if (!value) return;

                        }
                    )}
                > 
                    Open Modal
                </Button>
                <Button
                    color={Button.Colors.YELLOW}
                    size={Button.Sizes.SMALL}
                    look={Button.Looks.FILLED}
                    onClick={() => openConfirmationModal(
                        {
                            content: 'Do you want to restart discord?',
                            type: 'warn',
                            confirmText: 'THIS IS NOT WUMPUS!!!',
                            cancelText: 'uWUntu'
                        },
                        (value) => {
                            if (!value) return;
                            window.HykordNative.relaunchApp();
                        }
                    )}
                > 
                    Restart
                </Button>
            </ErrorBoundary>
        )
    }
}