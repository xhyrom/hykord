import { Forms } from '@hykord/components';
import { React } from '@hykord/webpack';
import { ErrorBoundary } from '@hykord/components';
import { shell } from 'electron';

export default ErrorBoundary.wrap(() => {
    const [details, setDetails] = React.useState({
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
            <a onClick={() => details.repositoryUrl !== '#' && shell.openExternal(details.repositoryUrl)} href={details.repositoryUrl}>
                {details.repositoryName}
            </a>
            ({details.hash.slice(0, 7)})
        </Forms.FormText>
    </Forms.FormSection>
})