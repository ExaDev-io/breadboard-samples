export class ControllableAsyncGeneratorRunner<
	TReturn,
	TNext,
	TNextReturn,
	TGenerateParams
> {
	public get finished(): boolean {
		return this._finished;
	}

	public get active(): boolean {
		return this._active;
	}

	public get paused(): boolean {
		return this._paused;
	}

	private pausePromiseResolve: undefined | ((value?: unknown) => void);
	private _paused: boolean = false;
	private _active: boolean = false;
	private _finished: boolean = false;

	constructor(
		private readonly generatorGenerator: (
			params?: TGenerateParams
		) => AsyncGenerator<TReturn, TNext, TNextReturn>,
		private readonly handler: (value: TReturn) => unknown,
		private readonly generatorParams?: TGenerateParams
	) {}

	run(): void {
		const generator = this.generatorGenerator(this.generatorParams);
		const handler = this.handler;
		this._active = true;
		this._paused = false;
		this._finished = false;
		(async (): Promise<void> => {
			try {
				let next = await generator.next();
				while (this._active && !next.done) {
					if (this._paused) {
						await new Promise((resolve): void => {
							this.pausePromiseResolve = resolve;
						});
					}
					await handler(next.value);
					next = await generator.next();
				}
				console.debug("ServiceWorker", "generator done");
				this._finished = true
			} catch (error) {
				console.error(error);
			} finally {
				this.stop();
			}
		})();
	}

	start(): void {
		if (!this._active) {
			this._active = true;
			this._paused = false;
			this._finished = false;
			this.run();
		} else if (this._paused) {
			this._paused = false;
			this._finished = false;
			this.pausePromiseResolve?.();
		}
	}

	pause(): void {
		this._paused = true;
	}

	stop() {
		if (this._active) {
			this._active = false;
			this._paused = false;
			this.pausePromiseResolve?.();
		}
	}
}
