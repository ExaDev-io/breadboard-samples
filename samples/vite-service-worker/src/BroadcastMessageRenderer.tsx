import React, { useEffect, useState } from 'react';
import { BroadcastMessage } from 'src/lib/BroadcastMessage.tsx';
import { SW_BROADCAST_CHANNEL } from "src/lib/constants.ts";

const BasicMessage: React.FC<{ message: BroadcastMessage; }> = ({ message }) => {
	const renderContent = () => {
		if (typeof message === 'object' && message !== null) {
			return <pre>{JSON.stringify(message, null, 2)}</pre>;
		}
		return <div>{(message as string).toString()}</div>;
	};

	return <div style={{ padding: '10px', margin: '5px', border: '1px solid grey' }}>
		{renderContent()}
	</div>;
};

// Example component for a fancy message style
const FancyMessage: React.FC<{ message: BroadcastMessage; }> = ({ message }) => <div style={{ color: 'blue' }}><p>{message.content as string}</p></div>;

export function BroadcastMessageRenderer({ channelId = SW_BROADCAST_CHANNEL, matchers = [], ignoreMatchers = [], defaultMessageComponent = BasicMessage }: {
	channelId: string;
	matchers?: [matcher: (message: BroadcastMessage) => boolean, component: React.ComponentType<{ message: BroadcastMessage; }>][]; // Array of tuples of matcher functions and components
	ignoreMatchers?: ((message: BroadcastMessage) => boolean)[];
	defaultMessageComponent?: React.ComponentType<{ message: BroadcastMessage; }>;
}) {
	const [messages, setMessages] = useState<BroadcastMessage[]>([]);

	useEffect(() => {
		const channel = new BroadcastChannel(channelId);

		const handleMessage = (e: MessageEvent) => {
			const newMessage = e.data as BroadcastMessage;
			if (ignoreMatchers && !ignoreMatchers.some((matcher: (arg0: BroadcastMessage) => boolean) => matcher(newMessage))) {
				setMessages(prevMessages => [...prevMessages, newMessage]);
			}
		};

		channel.addEventListener('message', handleMessage);

		return () => {
			channel.removeEventListener('message', handleMessage);
			channel.close();
		};
	}, [channelId, ignoreMatchers]);

	const renderMessage = (message: BroadcastMessage) => {
		for (const [matcher, Component] of matchers) {
			if (matcher(message)) {
				return <Component key={message.id} message={message} />;
			}
		}
		return React.createElement(defaultMessageComponent, { key: message.id, message: message });
	};

	return (
		<div>
			{messages.map(renderMessage)}
		</div>
	);
}

export default BroadcastMessageRenderer;
