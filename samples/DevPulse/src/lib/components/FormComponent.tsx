import React, { FormEvent, ReactNode, useEffect, useState } from "react";
import { InputRequest } from "~/lib/types/InputRequest";
import { ValidHTMLInputTypeAttributes } from "~/lib/types/ValidHTMLInputTypeAttributes";
import styles from "./FormComponent.module.scss";
import Button from "~/components/button";

export function FormComponent<T extends InputRequest>({
	request,
	handleSubmit,
}: {
	request: T;
	handleSubmit: (t: T) => void;
}): ReactNode {
	const [formData, setFormData] = useState<T>({} as T);
	const [rememberInput, setRememberInput] = useState<Record<string, boolean>>(
		{}
	);

	useEffect(() => {
		// Retrieve remembered values from local storage
		const savedValues = JSON.parse(
			localStorage.getItem("rememberedInputValues") || "{}"
		);
		setFormData(savedValues);
		setRememberInput(
			Object.keys(savedValues).reduce(
				(acc, key) => ({ ...acc, [key]: true }),
				{}
			)
		);
	}, []);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	}

	function handleRememberChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, checked } = e.target;
		setRememberInput({
			...rememberInput,
			[name]: checked,
		});
	}

	function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		submitResponse();
	}

	const schema = request.content.schema;
	const renderInputs = () => {
		const { properties } = schema;
		if (!properties) return null;
		return (
			<div className="inputRequest" key={request.id}>
				<h3>Node: {request.content.node}</h3>
				<details>
					<summary>Request</summary>
					<pre>{JSON.stringify(request, null, 2)}</pre>
				</details>
				{Object.entries(properties).map(([key, value]) => {
					const propertyId = `${request.content.node}.${key}`;
					return (
						<div
							key={key}
							style={{
								margin: "5px",
							}}
						>
							<label htmlFor={key} className={styles.label}>
								{value.title || key}
							</label>
							<br />
							<input
								type={getInputType(value.type)}
								name={propertyId}
								id={propertyId}
								placeholder={propertyId}
								value={
									(formData[propertyId] as
										| string
										| number
										| readonly string[]) || undefined
								}
								onChange={handleChange}
								onKeyUp={onKeyUp}
								className={styles.input}
							/>
							<br />
							<label
								htmlFor={`${propertyId}_remember`}
								style={{ marginLeft: "10px" }}
								className={styles.label}
							>
								<input
									id={`${propertyId}_remember`}
									type="checkbox"
									name={propertyId}
									checked={rememberInput[propertyId] || false}
									onChange={handleRememberChange}
									className={styles.input}
								/>
								<p
									style={{
										display: "inline-block",
										marginLeft: "5px",
									}}
								>
									Remember
								</p>
							</label>
						</div>
					);
				})}
			</div>
		);
	};

	function submitResponse() {
		// Save to local storage if the remember option is checked
		const savedValues = Object.keys(formData).reduce((acc, key) => {
			if (rememberInput[key]) {
				return { ...acc, [key]: formData[key] };
			}
			return acc;
		}, {});

		localStorage.setItem("rememberedInputValues", JSON.stringify(savedValues));

		handleSubmit(formData);
	}

	function onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			submitResponse();
		}
	}

	return (
		<form onSubmit={handleFormSubmit}>
			{schema.title && <h2>{schema.title}</h2>}
			{schema.description && <p>{schema.description}</p>}
			{renderInputs()}
			<Button type="submit">Submit</Button>
		</form>
	);
}

function getInputType(
	inputType: string | string[] | undefined
): React.HTMLInputTypeAttribute | undefined {
	// return validTypes.includes(input as HTMLInputTypeAttribute);
	if (typeof inputType === "string") {
		return ValidHTMLInputTypeAttributes.includes(inputType)
			? inputType
			: undefined;
	} else if (Array.isArray(inputType)) {
		if (
			inputType.every((type) => ValidHTMLInputTypeAttributes.includes(type))
		) {
			return "text";
		} else {
			console.warn(
				`Input type "${inputType}" not found in "${ValidHTMLInputTypeAttributes}"`
			);
			return undefined;
		}
	} else {
		console.warn(`Invalid input type: ${inputType}`);
		return undefined;
	}
}
