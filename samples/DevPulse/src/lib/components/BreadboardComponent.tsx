import { ReactNode, useState } from "react";
import OutputAccordionItem from "~/hnStory/components/output-accordion-item.tsx";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage.ts";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType.ts";
import { SW_BROADCAST_CHANNEL } from "../constants";
import BroadcastMessageRenderer from "./BroadcastMessageRenderer";
import { InputRequestsRenderer } from "./InputRequestsRenderer";
import { ServiceWorkerControllerComponent } from "./ServiceWorkerControllerComponent";
import { Spin } from "antd";

type StoryMatcher = [((message: BroadcastMessage) => boolean), ((message: BroadcastMessage) => ReactNode)];

const searchInProgressMatcher: StoryMatcher = [
	(message: BroadcastMessage): boolean => {
		return message.content != null && ("node" in (message.content as any)) && (message.content as any).node == "searchInProgress"
	}, () => <div>Search in progress</div>,
];

const storyMatcher: StoryMatcher = [
	(message: BroadcastMessage): boolean => {
		return message.content != null && ("node" in (message.content as any)) && (message.content as any).node == "story"
	}, (message: BroadcastMessage) => <OutputAccordionItem result={(message.content as any).content}/>,
]

const matchers: [((message: BroadcastMessage) => boolean), ((message: any) => ReactNode)][] = [
	searchInProgressMatcher,
	storyMatcher,
];

export function BreadboardComponent(): ReactNode {

	const [loading, setLoading] = useState<boolean>(false);

	const showLoading = () => {
		setLoading(true);
	}
	const hideLoading = () => {
		setLoading(false);
	};
	return (
		<>
			<ServiceWorkerControllerComponent />

			<InputRequestsRenderer setLoading={showLoading} />
			{loading && <Spin />}
			<BroadcastMessageRenderer
				channelId={SW_BROADCAST_CHANNEL}
				ignoreMatchers={[
					(message) => message.messageType != BroadcastMessageType.OUTPUT,
				]}
				matchers={matchers}
				onRenderMessages={hideLoading}
			/>
		</>
	);
}
