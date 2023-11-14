class reactorHelp {
	getLensFrame() {
		const lensFrame = window.top.frames?.[0];
		if (!lensFrame) { console.log('Lens iframe not found.'); }
		return lensFrame?.environmentSettings ? lensFrame: undefined;
	}

	getShellPayload() {
		return this.getLensFrame().getStore().getState().globals.shellPayload;
	}

	getShellFeatureFlags() {
		const featureFlags = this.getShellPayload().featureFlags;
		const featureFlagsSorted = {};
		Object.keys(featureFlags).sort().forEach(key => featureFlagsSorted[key] = featureFlags[key]);
		return featureFlagsSorted;
	}

	isFeatureFlagTrue(key) {
		return (
			this.getShellFeatureFlags()?.[key] === 'true' ||
			this.getShellFeatureFlags()?.[key] === true
		);
	}
}

window.reactorHelp = new reactorHelp();

console.log('reactorHelp added', window.reactorHelp);