import { findByDisplayName, React } from "webpack";

const FormTitle = findByDisplayName("FormTitle");

export default async() => {
	return () => {
		return (
			<FormTitle tag="h1">Example Plugin</FormTitle>
		)
	}
}
