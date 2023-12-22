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
	const { properties } = schema;
	if (!properties) return null;

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
		<form className={styles.form} onSubmit={handleFormSubmit}>
			{Object.entries(properties).map(([key, value]) => {
				return (
					<div className={styles.inputLabel}>
						<label htmlFor={key}>{value.title || key}</label>
						<input
							type={getInputType(value.type)}
							name={key}
							id={key}
							placeholder={key}
							value={
								(formData[key] as string | number | readonly string[]) ||
								undefined
							}
							onChange={handleChange}
							onKeyUp={onKeyUp}
							className={styles.input}
						/>
						<label htmlFor={`${key}_remember`} className={styles.checkboxLabel}>
							<input
								id={`${key}_remember`}
								type="checkbox"
								name={key}
								checked={rememberInput[key] || false}
								onChange={handleRememberChange}
								className={styles.checkbox}
							/>
							Remember
						</label>
					</div>
				);
			})}
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
