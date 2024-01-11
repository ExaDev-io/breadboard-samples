import { ReactNode } from "react";
import OutputAccordionItem from "~/hnStory/components/output-accordion-item.tsx";
import { BroadcastMessage } from "~/lib/types/BroadcastMessage.ts";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType.ts";
import { SW_BROADCAST_CHANNEL } from "../constants";
import BroadcastMessageRenderer from "./BroadcastMessageRenderer";
import { InputRequestsRenderer } from "./InputRequestsRenderer";
import { ServiceWorkerControllerComponent } from "./ServiceWorkerControllerComponent";

type Messagematcher = ((message: BroadcastMessage) => boolean);
type MessageRender = ((message: BroadcastMessage) => ReactNode);

type MessageMatcherAndComponent = [
	Messagematcher,
	MessageRender
];

const searchInProgressMatcher: MessageMatcherAndComponent = [
	(message: BroadcastMessage): boolean => message.content != null && ("node" in (message.content as any)) && (message.content as any).node == "searchInProgress",
	() => <div>Search in progress</div>,
];

const storyMatcher: MessageMatcherAndComponent = [
	(message: BroadcastMessage): boolean => message.content != null && ("node" in (message.content as any)) && (message.content as any).node == "story",
	(message: BroadcastMessage) => <OutputAccordionItem result={(message.content as any).content} />,
];

const matchers: [((message: BroadcastMessage) => boolean), ((message: any) => ReactNode)][] = [
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
	return <>
		<ServiceWorkerControllerComponent />
		<InputRequestsRenderer />
		<BroadcastMessageRenderer
			channelId={SW_BROADCAST_CHANNEL}
			ignoreMatchers={[
				(message) => message.messageType != BroadcastMessageType.OUTPUT,
			]}
			matchers={matchers}
		/>
	</>;
}
