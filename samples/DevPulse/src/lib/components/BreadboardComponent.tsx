import { Spin } from "antd";
import { ReactNode, useEffect, useState } from "react";
// import OutputAccordion from "~/hnStory/components/output-accordion-item.tsx";
import { StoryOutput } from "~/hnStory/domain";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage.ts";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType.ts";
import { SW_BROADCAST_CHANNEL } from "../constants";
import BroadcastMessageRenderer, {
	MessageMatcherComponent,
} from "./BroadcastMessageRenderer";
import { InputRequestsRenderer } from "./InputRequestsRenderer";
import { ServiceWorkerControllerComponent } from "./ServiceWorkerControllerComponent";
import OutputAccordion from "~/hnStory/components/output-accordion";

const searchInProgressMatcher: MessageMatcherComponent = [
	(message: BroadcastMessage): boolean =>
		message.content != null &&
		"node" in (message.content as any) &&
		(message.content as any).node == "searchInProgress",
	() => <div>Search in progress</div>,
];

const storyMatcher: MessageMatcherComponent = [
	(message: BroadcastMessage): boolean => {
		const content = message.content as any;
		// return content != null &&
		// 	content.outputs &&
		// 	Array.isArray(content.outputs) &&
		// 	content.outputs.some(
		// 		(output: any) => output.story_id != null
		// 	);
		return (
			content != null &&
			content.stories &&
			Array.isArray(content.stories) &&
			content.stories.some((story: StoryOutput) => story.story_id != null)
		);
	},
	(input: any) => {
		const message = input.message;
		const content = message.content;
		const [stories, setStories] = useState<StoryOutput[]>([]);
		// const stories = message.content.outputs as StoryOutput[];
		// return (
		// 	<OutputAccordion data={stories} />
		// 	);
		useEffect(() => {
			setStories(content.stories as StoryOutput[]);
		}, [content.stories]);
		// update global list of stories

		// render just the message excluding the stories object
		return <OutputAccordion data={stories} />;
	},
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
	};
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
