import React, { ReactNode, useEffect, useState } from "react";
import OutputAccordion from "~/hnStory/components/output-accordion";
import { StoryOutput } from "~/hnStory/domain";
import { SW_BROADCAST_CHANNEL } from "../constants";
import { BroadcastMessage } from "../types/BroadcastMessage";
import BasicMessage from "./BasicMessage";

export type MessageMatcher<T extends BroadcastMessage = BroadcastMessage> = (
	message: T
) => boolean;

export type MessageComponent<T extends BroadcastMessage = BroadcastMessage> =
	React.ComponentType<{
		message: T;
	}>;

export type MessageMatcherComponent<
	T extends BroadcastMessage = BroadcastMessage
> = [matcher: MessageMatcher<T>, component: MessageComponent<T>];

export function BroadcastMessageRenderer({
	channelId = SW_BROADCAST_CHANNEL,
	matchers = [],
	ignoreMatchers = [],
	defaultMessageComponent = BasicMessage,
	onRenderMessages,
}: {
	channelId: string;
	matchers?: MessageMatcherComponent[]; // Array of tuples of matcher functions and components
	ignoreMatchers?: ((message: BroadcastMessage) => boolean)[];
	defaultMessageComponent?: React.ComponentType<{ message: BroadcastMessage }>;
	onRenderMessages: () => void;
}): ReactNode {
	const [messages, setMessages] = useState<BroadcastMessage[]>([]);
	const [stories, setStories] = useState<StoryOutput[]>([]);

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
				setStories(
					(newMessage.content as { stories: StoryOutput[] })
						.stories as StoryOutput[]
				);
			}
		};

		channel.addEventListener("message", handleMessage);

		return () => {
			channel.removeEventListener("message", handleMessage);
			channel.close();
		};
	}, [channelId, ignoreMatchers]);

	useEffect(() => {
		if (messages?.length > 0) {
			onRenderMessages();
		}
	}, [messages]);

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

	return (
		<OutputAccordion
			data={stories}
		/>
	);
}

export default BroadcastMessageRenderer;
