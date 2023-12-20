import { ServiceWorkerStatus } from '~/lib/types/ServiceWorkerStatus.ts';
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
				for await (const value of generator) {
					if (this.state.active) {
						if (this.state.paused) {
							await new Promise((resolve): void => {
								this.pausePromiseResolve = resolve;
							});
						}
						await handler(value);
					} else {
						break;
					}
				}
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
			this.state.paused = false;
			this.state.finished = false;
			this.pausePromiseResolve?.();
		}
	}

	pause(): void {
		this.state.paused = true;
	}

	stop() {
		if (this.state.active) {
			this._state = this.stateInitialiser();
			this.pausePromiseResolve?.();
		}
	}
}
