import React, { useEffect, useState } from "react";
import BasicMessage from "./BasicMessage";
import { BroadcastMessage } from "../../lib/types";
import { SW_CONTROL_CHANNEL } from "~/lib/constants";

export function BroadcastMessageRenderer({
	channelId = SW_CONTROL_CHANNEL,
	matchers = [],
	ignoreMatchers = [],
	defaultMessageComponent = BasicMessage,
}: {
	channelId: string;
	matchers?: [
		matcher: (message: BroadcastMessage) => boolean,
		component: React.ComponentType<{ message: BroadcastMessage }>
	][]; // Array of tuples of matcher functions and components
	ignoreMatchers?: ((message: BroadcastMessage) => boolean)[];
	defaultMessageComponent?: React.ComponentType<{ message: BroadcastMessage }>;
}) {
	const [messages, setMessages] = useState<BroadcastMessage[]>([]);

	useEffect(() => {
		const channel = new BroadcastChannel(channelId);

		const handleMessage = (e: MessageEvent) => {
			const newMessage = e.data as BroadcastMessage;
			if (
				ignoreMatchers &&
				!ignoreMatchers.some((matcher: (arg0: BroadcastMessage) => boolean) =>
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

	const renderMessage = (message: BroadcastMessage) => {
		for (const [matcher, Component] of matchers) {
			if (matcher(message)) {
				return <Component key={message.id} message={message} />;
			}
		}
		return React.createElement(defaultMessageComponent, {
			key: message.id,
			message: message,
		});
	};

	return <div>{messages.map(renderMessage)}</div>;
}

// Example component for a fancy message style

export default BroadcastMessageRenderer;
