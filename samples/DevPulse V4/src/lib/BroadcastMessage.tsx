import { Schema } from '@google-labs/breadboard';
import { BroadcastChannelMember } from 'lib/BroadcastChannelMember.tsx';

// Define a type for individual messages

export enum BroadcastMessageTypes {
	COMMAND = 'command',
	STATUS = 'status',
	OUTPUT = 'output',
	INPUT_REQUEST = 'input_request',
	INPUT_RESPONSE = 'input_response',
}
export type BroadcastMessage = {
	id?: string;
	content?: unknown;
	messageType?: BroadcastMessageTypes
	messageSource?: BroadcastChannelMember;
	messageTarget?: BroadcastChannelMember;
};

export interface InputRequest extends BroadcastMessage {
	id: string;
	messageType: BroadcastMessageTypes.INPUT_REQUEST;
	messageSource: BroadcastChannelMember;
	messageTarget: BroadcastChannelMember;
	content: {
		node: string;
		attribute: string;
		schema: Schema;
	};
}

export interface InputResponse extends BroadcastMessage {
	id: string;
	messageType: BroadcastMessageTypes.INPUT_RESPONSE;
	messageSource: BroadcastChannelMember;
	messageTarget: BroadcastChannelMember;
	content: {
		node: string;
		attribute: string;
		value: unknown;
	};
}
