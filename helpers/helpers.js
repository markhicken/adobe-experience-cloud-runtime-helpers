const excHelp = {
	getImsProfile: () => {
		const profileEntry = Object.entries(sessionStorage).find(
			item => item[0].indexOf('adobeid_ims_profile') === 0
		);
		// console.log('Found profile entry for: ', profileEntry[0]);
		return JSON.parse(profileEntry[1]);
	},
	getOrgProductContexts: (orgId) => {
		return excHelp.getImsProfile().projectedProductContext.reduce((acc, item)=>{ 
			return acc.concat(item.prodCtx);
		}, []);
	},
	getOrgProductContextsByServiceCodeAndService: (serviceCode, service, orgId) => {
		return excHelp.getOrgProductContexts(orgId).filter(prodCtx=>{ 
			if (service) {
					return prodCtx.serviceCode === serviceCode && (
						prodCtx.services_enabled?.split(',').includes(service) ||
						prodCtx.enable_sub_service?.split(',').includes(service)
					);
			} else {
				return prodCtx.serviceCode === serviceCode;
			}
		});
	},
	getOrgServices: (orgId) => {
		return new Set(
			excHelp.getOrgProductContexts(orgId).reduce((prodCtxs, prodCtx)=>{ 
				return prodCtxs.concat(prodCtx.services_enabled?.split(',')).concat(prodCtx.enable_sub_service?.split(','));
			}, []).sort()
		);
	},
	hasOrgService: (service, orgId) => {
		if (!service) { return false; }
		return Array.from(excHelp.getOrgServices(orgId)).includes(service);
	}
}

window.excHelp = excHelp;

console.log('excHelp added', window.excHelp);

//--------------------------------------------------

const reactorHelp = {
	getLensFrame: () => {
		const lensFrame = window.top.frames?.[0];
		if (!lensFrame) { console.log('Lens iframe not found.'); }
		return lensFrame?.environmentSettings ? lensFrame: undefined;
	},
	getShellPayload: () => {
		return reactorHelp.getLensFrame().getStore().getState().globals.shellPayload;
	},
	getShellFeatureFlags: () => {
		const featureFlags = reactorHelp.getShellPayload().featureFlags;
		const featureFlagsSorted = {};
		Object.keys(featureFlags).sort().forEach(key => featureFlagsSorted[key] = featureFlags[key]);
		return featureFlagsSorted;
	},
	isFeatureFlagTrue: (key) => {
		return (
			reactorHelp.getShellFeatureFlags()?.[key] === 'true' ||
			reactorHelp.getShellFeatureFlags()?.[key] === true
		);
	}
}

window.reactorHelp = reactorHelp;

console.log('reactorHelp added', window.reactorHelp);