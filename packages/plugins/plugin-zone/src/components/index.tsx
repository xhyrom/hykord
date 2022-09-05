import { React } from '@hykord/webpack';
import { FormTitle, FormText, Flex } from '@hykord/components';
import { BASE_URL, PartialPlugin } from '../utils';
import Plugin from './cards/Plugin';

export default async() => {
	return () => {
		const [plugins, setPlugins]: [PartialPlugin[], (data) => void] = React.useState([]);

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
				{plugins.length === 0 ? <FormText>Loading...</FormText> : null}
				<Flex wrap={Flex.Wrap.WRAP} className='hykord-plugin-zone-cards'>
					{plugins.map(plugin => {
						return <>
							<Plugin pluginData={plugin} />
						</>
					})}
				</Flex>
			</>
		)
	}
}
