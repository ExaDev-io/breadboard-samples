import { Schema } from '@google-labs/breadboard';
import reactLogo from "assets/react.svg";
import React, { FormEvent, FormEventHandler, KeyboardEventHandler, MouseEventHandler, useEffect, useState } from 'react';
import "~/lib/App.css";
import { BroadcastMessageTypes } from "~/lib/BroadcastMessage.tsx";
import { BroadcastMessageRenderer } from "~/lib/BroadcastMessageRenderer.tsx";
import { ServiceWorkerControllerComponent } from "~/lib/ServiceWorkerControllerComponent.tsx";
import { SW_BROADCAST_CHANNEL } from "~/lib/constants.ts";
import { InputRequest, InputResponse } from './BroadcastMessage';
import viteLogo from "/vite.svg";

// function InputWithSubmit<T>({
// 	submitHandler,
// 	type,
// 	onKeyUp,
// 	onClick
// }: {
// 	type?: HTMLInputTypeAttribute;
// 	submitHandler: (value: SetStateAction<T>) => void;
// 	onKeyUp?: KeyboardEventHandler;
// 	onClick?: React.MouseEventHandler;
// 	// handleChange?: ChangeEventHandler;
// }): JSX.Element {
// 	const [inputValue, setInputValue] = useState<T>({} as T);

// 	function handleChange(event: { target: { value: SetStateAction<T>; }; }) {
// 		setInputValue(event.target.value);
// 	}

// 	onKeyUp = onKeyUp || ((event) => {
// 		if (event.key === 'Enter') {
// 			submitHandler(inputValue);
// 		}
// 	});

// 	onClick = onClick || (() => {
// 		submitHandler(inputValue);
// 	});

// 	return (
// 		<div>
// 			<input
// 				type={type}
// 				value={inputValue}
// 				onChange={handleChange}
// 				onKeyUp={onKeyUp}
// 				placeholder="Type something..." />
// 			<button onClick={onClick}>Submit</button>
// 		</div>
// 	);
// }

type FormProps = {
	schema: Schema;
};

function FormComponent<T>({
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
		const { properties } = schema;
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
				type="submit">Submit</button>
		</form>
	);
}

function BasicInput({ request }: { request: InputRequest; }) {
	const schema = request.content.schema;
	const node = request.content.node;
	const attribute = request.content.attribute;

	return (
		<div style={{
			fontFamily: "monospace",
			textAlign: "left",
			padding: "10px",
			margin: "5px",
			border: "1px solid grey",
			borderRadius: "5px"
		}}>
			<FormComponent
				schema={schema}
				handleSubmit={(formData) => {
					const message: InputResponse = {
						id: request.id,
						messageType: BroadcastMessageTypes.INPUT_RESPONSE,
						messageSource: request.messageTarget,
						messageTarget: request.messageSource,
						content: {
							node: node,
							attribute: attribute,
							value: formData,
						},
					};
					new BroadcastChannel(SW_BROADCAST_CHANNEL).postMessage(message);
				}} />
		</div>
	);
}

function InputRequestsRenderer<
	M extends InputRequest,
	I extends InputResponse
>({
	channelId = SW_BROADCAST_CHANNEL,
	matchers = [],
	ignoreMatchers = [],
	defaultMessageComponent = BasicInput,
	// defaultHandler
}: {
	channelId: string;
	matchers?: [
		matcher: (request: M) => boolean,
		component: React.ComponentType<{ request: M; }>,
		handler: (response: I) => void
	][];
	ignoreMatchers?: ((request: M) => boolean)[];
	defaultMessageComponent?: React.ComponentType<{ request: M; }>;
}) {
	const [requests, setRequests] = useState<M[]>([]);

	useEffect(() => {
		const channel = new BroadcastChannel(channelId);

		const handleMessage = (e: MessageEvent) => {
			if (e.data.messageType !== BroadcastMessageTypes.INPUT_REQUEST) return;

			const newMessage = e.data as M;
			if (
				ignoreMatchers &&
				!ignoreMatchers.some((matcher: (arg0: M) => boolean) =>
					matcher(newMessage)
				)
			) {
				setRequests((prevMessages) => [...prevMessages, newMessage]);
			}
		};

		channel.addEventListener("message", handleMessage);

		return () => {
			channel.removeEventListener("message", handleMessage);
			channel.close();
		};
	}, [channelId, ignoreMatchers, requests]);
	return (
		<div>
			{requests.map((request) => {
				for (const [matcher, Component] of matchers) {
					if (matcher(request)) {
						return <Component key={request.id} request={request} />;
					}
				}
				return React.createElement(defaultMessageComponent, {
					key: request.id,
					request: request,
				});
			})}
		</div>
	);
}

function App() {
	const [count, setCount] = useState(0);
	return (
		<>
			<div>
				<a href="https://vitejs.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
			<InputRequestsRenderer channelId={SW_BROADCAST_CHANNEL} />
			<ServiceWorkerControllerComponent />
			<BroadcastMessageRenderer
				channelId={SW_BROADCAST_CHANNEL}
				ignoreMatchers={[
					(message) => message.messageType != BroadcastMessageTypes.OUTPUT,
				]}
			/>
		</>
	);
}

export default App;
