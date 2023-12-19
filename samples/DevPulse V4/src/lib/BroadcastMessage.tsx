import { BroadcastChannelMember } from 'lib/BroadcastChannelMember.tsx';

// Define a type for individual messages

export enum BroadcastMessageTypes {
	COMMAND = 'command',
	STATUS = 'status',
	OUTPUT = 'output',
}
export type BroadcastMessage = {
	id?: string;
	content?: unknown;
	type?: BroadcastMessageTypes | string
  source?: BroadcastChannelMember;
  target?: BroadcastChannelMember;
};