import { Button, Card, Flex, Forms, Link } from '@hykord/components';
import { React } from '@hykord/webpack';
import { ErrorBoundary } from '@hykord/components';
import { Updater } from '../../utils';

interface Details {
    repositoryName: string;
    repositoryUrl: string;
    hash: string;
}

const Updates = (details: Details) => {
    return <Card
        body={
            <>
                {Updater.changes.map(commit =>
                    <Forms.FormText>
                        <Link href={`${details.repositoryUrl}/commit/${commit.hash}`}>{commit.hash}</Link> {commit.message} - {commit.author}
                    </Forms.FormText>
                )}
            </>
        }
    />
}

export default ErrorBoundary.wrap(() => {
    const [disabled, setDisabled] = React.useState({
        update: !Updater.isOutdated(),
        check: false,
    });
    const [details, setDetails] = React.useState<Details>({
        repositoryName: 'Loading...',
        repositoryUrl: '#',
        hash: '???'
    });

    React.useEffect(() => {
        (async() => {
            const repo = await HykordNative.getManagers().getGit().getRepository();
            setDetails({
                repositoryName: repo.name,
                repositoryUrl: repo.url,
                hash: await HykordNative.getManagers().getGit().getLatestCommitHash(),
            });
        })();
    }, []);

    return <Forms.FormSection tag='h1' title='Updater'>
        <Forms.FormText>
            <Link href={details.repositoryUrl}>{details.repositoryName}</Link> ({details.hash.slice(0, 7)})
        </Forms.FormText>
        <br />
        {Updater.isOutdated() ? <Updates {...details} /> : <Forms.FormText type={Forms.FormText.Types.LABEL_BOLD}>Hykord is up to date!</Forms.FormText>}
        <br />
        <Flex>
            <Button
                color={Button.Colors.BRAND_NEW}
                size={Button.Sizes.SMALL}
                look={Button.Looks.FILLED}
                disabled={disabled.update}
                onClick={async() => {
                    setDisabled({ update: true, check: true });
                    await Updater.downloadUpdate();
                    await Updater.checkForUpdates();
                    setDisabled({ update: !Updater.isOutdated(), check: false });
                }}
            >
                Update
            </Button>
            <Button
                color={Button.Colors.BRAND_NEW}
                size={Button.Sizes.SMALL}
                look={Button.Looks.FILLED}
                disabled={disabled.check}
                onClick={async() => {
                    setDisabled({ update: true, check: true });
                    await Updater.checkForUpdates();
                    setDisabled({ update: !Updater.isOutdated(), check: false });
                }}
            >
                Check For Updates
            </Button>
        </Flex>
    </Forms.FormSection>
})