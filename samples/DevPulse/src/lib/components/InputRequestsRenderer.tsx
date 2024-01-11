import React, { ComponentType, ReactNode, useEffect, useState } from "react";
import { BroadcastMessageType } from "~/lib/types/BroadcastMessageType.ts";
import { InputRequest } from "~/lib/types/InputRequest.ts";
import { BasicInput } from "./BasicInput";
import { sendStatusRequestToServiceWorker } from "../functions/SendStatusRequestToServiceWorker";
import { BroadcastChannelMember } from "../types/BroadcastChannelMember";
import { addBroadcastListener } from "../functions/AddBroadcastListener";
import { ServiceWorkerStatusResponse } from "../types/ServiceWorkerStatusResponse";
import { RunnerState } from "../types/RunnerState";
import styles from "./InputRequestRenderer.module.scss";

export function InputRequestsRenderer<
	M extends InputRequest,
	P extends object = {
		[key: string]: M;
	}
>({
	matchers = [],
	defaultMessageComponent = BasicInput,
	setLoading
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
		onSubmit: () => void;
	}>;
	setLoading: () => void;
}): ReactNode {
	const [requests, setRequests] = useState<P>({} as P);

	useEffect(() => {
		addBroadcastListener<
			ServiceWorkerStatusResponse & {
				content: RunnerState;
			}
		>({
			handler: (evt) => {
				const pendingInputrequests: P = evt.data.content
					.pendingInputs as unknown as P;
				setRequests(pendingInputrequests);
			},
			messageSource: BroadcastChannelMember.ServiceWorker,
			messageType: BroadcastMessageType.STATUS,
		});
	}, [requests]);

	useEffect(() => {
		sendStatusRequestToServiceWorker();
	}, []);

	return (
		<div className={styles.main}>
			{Object.entries(requests).map(([, request]) => {
				for (const [matcher, Component] of matchers) {
					if (matcher(request)) {
						return (
							<Component
								key={request.id}
								request={request}
								onResponseSent={dismissInputOnSend<M, P>(setRequests, request)}
							/>
						);
					}
				}
				return React.createElement(defaultMessageComponent, {
					key: request.id,
					request: request,
					onResponseSent: dismissInputOnSend<M, P>(setRequests, request),
					onSubmit: setLoading
				});
			})}
		</div>
	);
}

function dismissInputOnSend<
	R extends InputRequest,
	P = {
		[key: string]: R;
	}
>(
	setRequests: React.Dispatch<React.SetStateAction<P>>,
	request: R
): () => void {
	return () => {
		setRequests((prevMessages) => {
			const newMessages = { ...prevMessages };
			delete newMessages[request.id as keyof P];
			return newMessages;
		});
	};
}
