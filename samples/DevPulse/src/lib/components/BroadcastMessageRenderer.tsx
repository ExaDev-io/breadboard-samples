import React, { ReactNode, useEffect, useState } from "react";
import { SW_BROADCAST_CHANNEL } from "../constants";
import { StoryOutput } from "~/hnStory/domain";
import OutputAccordionItem from "~/hnStory/components/output-accordion-item";
import styles from "../../hnStory/components/output-accordion.module.scss";

export function BroadcastMessageRenderer({
	channelId = SW_BROADCAST_CHANNEL,
}: {
	channelId: string;
	outputComponent?: React.ComponentType<{ output: StoryOutput }>;
}): ReactNode {
	const [stories, setStories] = useState<StoryOutput[]>([]);

	useEffect(() => {
		const channel = new BroadcastChannel(channelId);

		const handleMessage = (e: MessageEvent) => {
			//setMessages(e.data as BroadcastMessage[]);
			setStories(e.data.content.outputs as StoryOutput[]);
		};

		channel.addEventListener("message", handleMessage);
		//if the message type is output and if the node id is not in the list of ignored ones, then we want to access the outputs and use them as an array of StoryOutput[]

		return () => {
			channel.removeEventListener("message", handleMessage);
			channel.close();
		};
	}, [channelId]);

	/* const renderMessage = (message: BroadcastMessage) => {
		const outputStories = message.content;
		setStories(outputStories as StoryOutput[]);
		return React.createElement(outputComponent, {
			key: message.id,
			output: stories,
		});
	}; */
	console.log(stories);
	return (
		<div className={styles.container}>
			{stories
				? stories.map((story: StoryOutput) => (
						<OutputAccordionItem result={story} />
				  ))
				: null}
		</div>
	);
}

// Example component for a fancy message style

export default BroadcastMessageRenderer;
