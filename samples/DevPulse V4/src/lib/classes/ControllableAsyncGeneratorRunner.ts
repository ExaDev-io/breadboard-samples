import { ServiceWorkerStatus } from '~/lib/types/ServiceWorkerStatus.ts';
import SendStatus from '../functions/SendStatus';
export class ControllableAsyncGeneratorRunner<
	TReturn,
	TNext,
	TNextReturn,
	TGenerateParams,
	TState extends ServiceWorkerStatus = ServiceWorkerStatus
> {
	public get state(): TState {
		return this._state;
	}

	private pausePromiseResolve: undefined | ((value?: unknown) => void);

	constructor(
		private readonly generatorGenerator: (
			params?: TGenerateParams
		) => AsyncGenerator<TReturn, TNext, TNextReturn>,
		private readonly handler: (value: TReturn) => unknown,
		private readonly generatorParams?: TGenerateParams,
		private readonly stateInitialiser: () => TState = () => ({
			active: false,
			paused: false,
			finished: false
		} as TState),
		private _state: TState = stateInitialiser() ?? {} as TState,
	) {}

	run(): void {
		const generator: AsyncGenerator<TReturn, TNext, TNextReturn | undefined> = this.generatorGenerator(this.generatorParams)
		const handler = this.handler;
		(async (): Promise<void> => {
			try {
				let next = await generator.next();
				while (this.state.active && !next.done) {
					if (this.state.paused) {
						await new Promise((resolve): void => {
							this.pausePromiseResolve = resolve;
						});
					}
					await handler(next.value);
					next = await generator.next();
				}
				console.debug("ServiceWorker", "generator done");
				this.state.finished = true
			} catch (error) {
				console.error(error);
			} finally {
				this.stop();
			}
		})();
	}

	start(): void {
		if (!this.state.active) {
			this._state = this.stateInitialiser();
			this.state.active = true;
			this.run();
		} else if (this.state.paused) {
			console.debug("ServiceWorker", "resuming");
			this.state.paused = false;
			this.state.finished = false;
			SendStatus();
			this.pausePromiseResolve?.();
		} else {
			console.warn("ServiceWorker", "already started");
			SendStatus();
		}
	}

	pause(): void {
		this.state.paused = true;
		SendStatus();
	}

	stop() {
		if (this.state.active) {
			this._state = this.stateInitialiser();
			this.pausePromiseResolve?.();
		}
		SendStatus();
	}
}
