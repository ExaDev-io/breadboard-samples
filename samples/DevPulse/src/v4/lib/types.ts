
export interface BroadcastChannelEventHandler<
	M extends BroadcastMessage,
	E = MessageEvent<M>
> {
	(evt: E): void;
}

export enum BroadcastChannelMember {
	ServiceWorker = "service_worker",
	Client = "client"
}

// Define a type for individual messages

export enum BroadcastMessageTypes {
	COMMAND = 'command',
	STATUS = 'status',
	OUTPUT = 'output',
}
export type BroadcastMessage = {
	id?: string;
	content?: unknown;
	messageType?: BroadcastMessageTypes
	messageSource?: BroadcastChannelMember;
	messageTarget?: BroadcastChannelMember;
};

export type ResponseForMessage<T extends BroadcastMessage> = {
	id?: T["id"];
	// type?: T["type"];
	target?: T["messageSource"];
	source?: T["messageTarget"];
} & BroadcastMessage;


export enum ServiceWorkerControllerCommand {
	START = "start",
	PAUSE = "pause",
	STOP = "stop"
  }
  
export type ServiceWorkerStatus = {
	active: boolean;
	paused: boolean;
	finished: boolean;
	pendingInputResolvers?: Record<string, unknown>;
};



