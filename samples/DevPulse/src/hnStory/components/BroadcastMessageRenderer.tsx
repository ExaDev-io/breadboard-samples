import React, { useEffect, useState } from "react";
import BasicMessage from "./BasicMessage.tsx";
import { BroadcastData } from "~/lib/sw/types.ts";
import { SW_CONTROL_CHANNEL } from "~/lib/constants.ts";

export function BroadcastMessageRenderer({
	channelId = SW_CONTROL_CHANNEL,
	matchers = [],
	ignoreMatchers = [],
	defaultMessageComponent = BasicMessage,
}: {
	channelId: string;
	matchers?: [
		matcher: (message: BroadcastData) => boolean,
		component: React.ComponentType<{ message: BroadcastData }>
	][]; // Array of tuples of matcher functions and components
	ignoreMatchers?: ((message: BroadcastData) => boolean)[];
	defaultMessageComponent?: React.ComponentType<{ message: BroadcastData }>;
}) {
	const [messages, setMessages] = useState<BroadcastData[]>([]);

	useEffect(() => {
		const channel = new BroadcastChannel(channelId);

		const handleMessage = (e: MessageEvent) => {
			const newMessage = e.data as BroadcastData;
			if (
				ignoreMatchers &&
				!ignoreMatchers.some((matcher: (arg0: BroadcastData) => boolean) =>
					matcher(newMessage)
				)
			) {
				setMessages((prevMessages) => [...prevMessages, newMessage]);
			}
		};

		channel.addEventListener("message", handleMessage);

		return () => {
			channel.removeEventListener("message", handleMessage);
			channel.close();
		};
	}, [channelId, ignoreMatchers]);

	const renderMessage = (message: BroadcastData) => {
		for (const [matcher, Component] of matchers) {
			if (matcher(message)) {
				return <Component message={message} />;
			}
		}
		return React.createElement(defaultMessageComponent, {
			message: message,
		});
	};

	console.log(messages);

	return <div>{messages.map(renderMessage)}</div>;
}

// Example component for a fancy message style

export default BroadcastMessageRenderer;
