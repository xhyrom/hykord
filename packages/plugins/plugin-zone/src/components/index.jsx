import { React } from '@hykord/webpack';
import { FormTitle } from '@hykord/components';

const BASE_URL = 'https://xhyrom-utils.github.io/hykord-plugins';

export default async() => {
	return () => {
		const [plugins, setPlugins] = React.useState([]);

		const getPlugins = async() => {
			const data = await (await fetch(`${BASE_URL}/plugins.json`)).json();

			setPlugins(data);
		}

		React.useEffect(() => {
			getPlugins();
		}, []);

		return (
			<>
				<FormTitle tag='h1'>Plugin Zone</FormTitle>
				{plugins.map(plugin => {
					return <h1>{plugin}</h1>
				})}
			</>
		)
	}
}
