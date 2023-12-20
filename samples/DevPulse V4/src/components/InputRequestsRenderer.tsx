import React, { ComponentType, ReactNode, useEffect, useState } from "react";
import { BasicInput } from "~/components/BasicInput.tsx";
import { SW_BROADCAST_CHANNEL } from "~/lib/constants/SW_BROADCAST_CHANNEL.ts";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType.ts";
import { InputRequest } from "~/lib/types/InputRequest.ts";

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
	const [requests, setRequests] = useState<M[]>([]);

	useEffect(() => {
		const channel = new BroadcastChannel(channelId);

		const handleMessage = (e: MessageEvent) => {
			if (e.data.messageType !== BroadcastMessageType.INPUT_REQUEST) return;

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
						return <Component
							key={request.id}
							request={request}
							onResponseSent={() => {
								setRequests((prevMessages) =>
									prevMessages.filter((m) => m.id !== request.id)
								);
							}}
						/>;
					}
				}
				return React.createElement(defaultMessageComponent, {
					key: request.id,
					request: request,
					onResponseSent: () => {
						setRequests((prevMessages) =>
							prevMessages.filter((m) => m.id !== request.id)
						);
					},
				});
			})}
		</div>
	);
}
