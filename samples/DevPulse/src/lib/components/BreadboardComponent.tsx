import { Spin } from "antd";
import { ReactNode, useState } from "react";
import OutputAccordionItem from "~/hnStory/components/output-accordion-item.tsx";
import { StoryOutput } from "~/hnStory/domain";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage.ts";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType.ts";
import { SW_BROADCAST_CHANNEL } from "../constants";
import BroadcastMessageRenderer, { MessageMatcherComponent } from "./BroadcastMessageRenderer";
import { InputRequestsRenderer } from "./InputRequestsRenderer";
import { ServiceWorkerControllerComponent } from "./ServiceWorkerControllerComponent";

const searchInProgressMatcher: MessageMatcherComponent = [
	(message: BroadcastMessage): boolean => message.content != null && ("node" in (message.content as any)) && (message.content as any).node == "searchInProgress",
	() => <div>Search in progress</div>,
];

const storyMatcher: MessageMatcherComponent = [
	(message: BroadcastMessage): boolean => {
		const content = message.content as any;
		return content != null &&
			content.outputs &&
			Array.isArray(content.outputs) &&
			content.outputs.some(
				(output: any) => output.story_id != null
			);
	},
	(input: any) => {
		const message = input.message
		const content = message.content
		const stories = content.outputs as StoryOutput[];
		// const stories = message.content.outputs as StoryOutput[];
		return (
			<div>
				{stories.map((story) => (
					<OutputAccordionItem result={story} key={story.story_id}/>
				))}
			</div>
		);
	}
];

const matchers: MessageMatcherComponent[] = [
	searchInProgressMatcher,
	storyMatcher,
];

// PlaceHolder renders a given elment if all of the children
// const PlaceHolder = ({ placeholder, children }: { placeholder: ReactNode; children: ReactNode; }): ReactNode => {
// 	const childrenArray = React.Children.toArray(children);
// 	const allChildrenAreNull = childrenArray.every((child) => child == null);
// 	return allChildrenAreNull ? placeholder : children;
// };

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
