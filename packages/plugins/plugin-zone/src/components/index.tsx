import { React } from '@hykord/webpack';
import { FormTitle, FormText, Card, Flex, Markdown, Button } from '@hykord/components';
import { BASE_URL, downloadPlugin, PartialPlugin } from '../utils';

export default async() => {
	return () => {
		const [plugins, setPlugins]: [PartialPlugin[], (data) => void] = React.useState([]);

		const getPlugins = async() => {
			const data = await (await fetch(`${BASE_URL}/plugins.json`)).json();

			setPlugins(Array(15).fill(data[0]));
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
							<Card className="hykord-card">
								<Flex justify={Flex.Justify.START} align={Flex.Align.CENTER}>
									<FormText tag="h5">
										<strong>{plugin.name}</strong>{plugin.author ? <> by <strong>{plugin.author || '-'}</strong></> : null }
									</FormText>

									<Flex justify={Flex.Justify.END}>
										<Button
											color={Button.Colors.BRAND_NEW}
											size={Button.Sizes.TINY}
											look={Button.Looks.OUTLINED}
											onClick={() => downloadPlugin(plugin)}
										>
											Install plugin
										</Button>
									</Flex>
								</Flex>
								<br />
								<Markdown>{plugin.description || ''}</Markdown>
							</Card>
						</>
					})}
				</Flex>
			</>
		)
	}
}
