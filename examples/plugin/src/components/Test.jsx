import { React } from "webpack";
import { FormTitle } from "components";

export default async() => {
	return () => {
		return (
			<FormTitle tag="h1">Example Plugin</FormTitle>
		)
	}
}
