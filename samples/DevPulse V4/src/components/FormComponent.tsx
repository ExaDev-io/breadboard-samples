import { Schema } from "@google-labs/breadboard";
import React, { FormEvent, FormEventHandler, KeyboardEventHandler, MouseEventHandler, useState } from "react";

export function FormComponent<T>({
	                                 schema,
	                                 handleSubmit,
	                                 onKeyUp,
	                                 onClick,
	                                 onSubmit
                                 }: {
	schema: Schema;
	handleSubmit: (t: T) => void;
	onKeyUp?: KeyboardEventHandler;
	onClick?: MouseEventHandler;
	onSubmit?: FormEventHandler<HTMLFormElement>;
	// handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
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

	const renderInputs = () => {
		const {properties} = schema;
		if (!properties) return null;

		return Object.entries(properties).map(([key, value]) => (
			<div key={key}>
				<label htmlFor={key}>{value.title || key}</label>
				<input
					type={value.type === 'string' ? 'text' : 'number'}
					name={key}
					id={key}
					value={
						(formData as Record<string, unknown>)[key] as string | number | readonly string[] | undefined || ''
					}
					onChange={handleChange}
					onKeyUp={onKeyUp}
					// onClick={onClick}
				/>
			</div>
		));
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
