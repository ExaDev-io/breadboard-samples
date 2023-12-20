import React, {
	FormEvent,
	FormEventHandler,
	KeyboardEventHandler,
	MouseEventHandler,
	ReactNode,
	useState
} from "react";
import { InputRequest } from "~/lib/types/InputRequest";

export function FormComponent<T extends InputRequest>({
	// schema,
	request,
	handleSubmit,
	onKeyUp,
	onClick,
	onSubmit
}: {
		// schema: Schema;
		request: T;
	handleSubmit: (t: T) => void;
	onKeyUp?: KeyboardEventHandler;
	onClick?: MouseEventHandler;
	onSubmit?: FormEventHandler<HTMLFormElement>;
	// handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}): ReactNode {
	const [formData, setFormData] = useState<T>({} as T);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	// handleSubmit ??= ((e: React.FormEvent<HTMLFormElement>) => {
	// 	e.preventDefault();
	// 	console.log('Form Data Submitted:', formData);
	// });

	const schema = request.content.schema;
	const renderInputs = () => {
		const { properties } = schema;
		if (!properties) return null;
		return (<div className="inputRequest" key={request.id}>
			<h3>Node: {request.content.node}</h3>
			<details>
				<summary>Request</summary>
				<pre>{JSON.stringify(request, null, 2)}</pre>
			</details>
			{/* map from properties */}
			{Object.entries(properties).map(([key, value]) => (
				<div key={key}>
					<label htmlFor={key}>{value.title || key}</label>
					<br />
					<input
						type={getInputType(value.type)}
						name={key}
						id={key}
						placeholder={key}
						value={
							(formData as Record<string, unknown>)[key] as string | number | readonly string[] | undefined || ''
						}
						onChange={handleChange}
						onKeyUp={onKeyUp}
					// onClick={onClick}
					/>
				</div>
			))}
		</div>);
	};

	onKeyUp ??= ((event) => {
		if (event.key === 'Enter') {
			handleSubmit(formData);
		}
	});
	onClick ??= (() => {
		handleSubmit(formData);
	});
	onSubmit ??= ((e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		handleSubmit(formData);
	});


	return (
		<form onSubmit={onSubmit}>
			{schema.title && <h2>{schema.title}</h2>}
			{schema.description && <p>{schema.description}</p>}
			{renderInputs()}
			<button
				onClick={onClick}
				type="submit">Submit
			</button>
		</form>
	);
}
function getInputType(inputType: string | string[] | undefined): React.HTMLInputTypeAttribute | undefined {
	const validTypes = [
		"button", "checkbox", "color", "date", "datetime-local", "email",
		"file", "hidden", "image", "month", "number", "password", "radio",
		"range", "reset", "search", "submit", "tel", "text", "time",
		"url", "week"
	];
	// return validTypes.includes(input as HTMLInputTypeAttribute);
	if (typeof inputType === 'string') {
		return validTypes.includes(inputType) ? inputType : undefined;
	} else if (Array.isArray(inputType)) {
		if (inputType.length === 1) {
			return validTypes.includes(inputType[0]) ? inputType[0] : undefined;
		} else if (inputType.length > 1) {
			// all of the types must exist in validTypes
			if (inputType.every((type) => validTypes.includes(type))) {
				return "text";
			} else {
				console.warn(`Invalid input types: ${inputType}`);
				return undefined;
			}
		}
	} else {
		console.warn(`Invalid input type: ${inputType}`);
		return undefined;
	}
}

