export type ClaudeResponse = {
	completion: string;
	stop_reason: "stop_sequence" | "max_tokens";
};

export type ClaudeParams = {
	apiKey: string;
	model: "claude-2" | "claude-instant-1";
	userQuestion: string;
	maxTokens: number;
	stopSequences?: string[];
	temperature?: number;
	topP?: number;
	topK?: number;
	stream?: boolean;
	url?: string;
};

