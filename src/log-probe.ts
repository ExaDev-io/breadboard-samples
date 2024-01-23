import { Probe, ProbeMessage } from "@google-labs/breadboard";

export class LogProbe implements Probe {
	// Assuming ProbeMessage has a toString method or similar
	async report(message: ProbeMessage): Promise<void> {
		console.log(`Report: ${message.toString()}`);
	}

	addEventListener(type: string, _callback: EventListenerOrEventListenerObject | null, _options?: boolean | AddEventListenerOptions | undefined): void {
		// Stub implementation
		console.log(`Added event listener for type: ${type}`);
	}

	dispatchEvent(event: Event): boolean {
		// Dispatch the event
		console.log(`Event dispatched: ${event.type}`);
		return true; // Assuming the event is always dispatched successfully
	}

	removeEventListener(type: string, _callback: EventListenerOrEventListenerObject | null, _options?: boolean | EventListenerOptions | undefined): void {
		// Stub implementation
		console.log(`Removed event listener for type: ${type}`);
	}
}
