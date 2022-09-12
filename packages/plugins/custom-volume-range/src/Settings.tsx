import { React } from '@hykord/webpack';
import { FormLabel, FormTitle, FormItem, ErrorBoundary } from '@hykord/components';
import { Text } from '@hykord/components/inputs';

export default async() => {
	return () => {
        const [volumeOption, setVolumeOption] = React.useState({
            value: 200,
            error: ''
        });

		return (
			<ErrorBoundary>
				<FormTitle tag='h1'>Custom Volume Range</FormTitle>
                <FormItem>
                    <FormLabel>
                        Increase maximum volume
                    </FormLabel>
                    <Text
                        placeholder='Type maximum volume'
                        type='number'
                        error={volumeOption.error}
                        value={volumeOption.value}
                        onChange={value => {
                            if (value > 5000) {
                                setVolumeOption({
                                    ...volumeOption,
                                    error: 'Maximum allowed volume is 5000.'
                                })
                            }

                            setVolumeOption({
                                error: '',
                                value: value
                            })
                        }}
                    />
                </FormItem>
				{/* <Slider
                    note="Set volume"
                    initialValue={200}
                    minValue={200}
                    maxValue={1000}
                    defaultValue={value}
                    onValueChange={(v) => setValue(v)}
                    onMarkerRender={s => `${s}%`}
                >
                    Max Volume
                </Slider> */}
			</ErrorBoundary>
		)
	}
}
