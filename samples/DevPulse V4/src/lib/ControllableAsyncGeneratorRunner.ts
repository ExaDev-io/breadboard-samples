export class ControllableAsyncGeneratorRunner<
	TReturn,
	TNext,
	TNextReturn,
	TGenerateParams
> {
	private pausePromiseResolve: undefined | ((value?: unknown) => void);
	private paused: boolean = false;
	private active: boolean = false;

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
		this.active = true;
		this.paused = false;
		(async (): Promise<void> => {
			try {
				let next = await generator.next();
				while (this.active && !next.done) {
					if (this.paused) {
						await new Promise((resolve): void => {
							this.pausePromiseResolve = resolve;
						});
					}
					await handler(next.value);
					next = await generator.next();
				}
				console.debug("ServiceWorker", "generator done");
			} catch (error) {
				console.error(error);
			} finally {
				this.stop();
			}
		})();
	}

	start(): void {
		if (!this.active) {
			this.active = true;
			this.paused = false;
			this.run();
		} else if (this.paused) {
			this.paused = false;
			this.pausePromiseResolve?.();
		}
	}

	pause(): void {
		this.paused = true;
	}

	stop() {
		if (this.active) {
			this.active = false;
			this.paused = false;
			this.pausePromiseResolve?.();
		}
	}
}
