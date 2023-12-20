import React, { ComponentType, ReactNode, useEffect, useState } from "react";
import { BasicInput } from "~/components/BasicInput.tsx";
import { SW_BROADCAST_CHANNEL } from "~/lib/constants/SW_BROADCAST_CHANNEL.ts";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType.ts";
import { InputRequest } from "~/lib/types/InputRequest.ts";

const localStorageKeys = {
	inputRequests: "inputRequests",
} as const

export function InputRequestsRenderer<
	M extends InputRequest,
>({
	channelId = SW_BROADCAST_CHANNEL,
	matchers = [],
	ignoreMatchers = [],
	defaultMessageComponent = BasicInput,
}: {
	channelId?: string;
	matchers?: [
		matcher: (request: M) => boolean,
		component: ComponentType<{
			request: M;
			onResponseSent: () => void;
		}>
	][];
	ignoreMatchers?: ((request: M) => boolean)[];
		defaultMessageComponent?: ComponentType<{
			request: M;
			onResponseSent: () => void;
		}>;
}): ReactNode {
	const [requests, setRequests] = useState<M[]>(() => {
		// Initialize state from local storage
		const savedRequests = localStorage.getItem(localStorageKeys.inputRequests);
		return savedRequests ? JSON.parse(savedRequests) : [];
	});

	useEffect(() => {
		const channel = new BroadcastChannel(channelId);

		const handleMessage = (e: MessageEvent) => {
			if (e.data.messageType !== BroadcastMessageType.INPUT_REQUEST) return;

			const newMessage = e.data as M;
			// Check if the message should be ignored based on ignoreMatchers
			if (ignoreMatchers && ignoreMatchers.some(matcher => matcher(newMessage))) {
				return;
			}

			// Update the requests state only if the new message's ID is not already present
			setRequests(prevMessages => {
				const isDuplicate = prevMessages.some(m => m.id === newMessage.id);
				return isDuplicate ? prevMessages : [...prevMessages, newMessage];
			});
		};

		channel.addEventListener("message", handleMessage);

		return () => {
			channel.removeEventListener("message", handleMessage);
			channel.close();
		};
	}, [channelId, ignoreMatchers]);

	useEffect(() => {
		// Save to local storage whenever 'requests' changes
		localStorage.setItem(localStorageKeys.inputRequests, JSON.stringify(requests));
	}, [requests]);

	return (
		<div>
			{requests.map((request) => {
				for (const [matcher, Component] of matchers) {
					if (matcher(request)) {
						return <Component
							key={request.id}
							request={request}
							onResponseSent={dismissInputOnSend<M>(setRequests, request)}
						/>;
					}
				}
				return React.createElement(defaultMessageComponent, {
					key: request.id,
					request: request,
					onResponseSent: dismissInputOnSend<M>(setRequests, request)
				});
			})}
		</div>
	);
}

function dismissInputOnSend<M extends InputRequest>(setRequests: React.Dispatch<React.SetStateAction<M[]>>, request: M): () => void {
	return () => {
		setRequests((prevMessages) => prevMessages.filter((m) => m.id !== request.id)
		);
	};
}

