// this script can be embedded from it's published location using the following code...
// document.addEventListener("DOMContentLoaded", () => {
//   const script = document.createElement("script");
//   script.src = 'https://markhicken.github.io/adobe-experience-cloud-runtime-helpers/helpers.js';
//   script.async = true;
//   document.head.appendChild(script);
// });

// see https://github.com/markhicken/adobe-experience-cloud-runtime-helpers
const excHelp = {
	getImsAccessToken: () => {
		const accessTokenEntry = Object.entries(sessionStorage).find(
			item => item[0].match(/^adobeid_ims_access_token/)
		);
		return JSON.parse(accessTokenEntry[1])?.tokenValue;
	},
	getImsProfile: () => {
		const profileEntry = Object.entries(sessionStorage).find(
			item => item[0].match(/^adobeid_ims_profile/)
		);
		return JSON.parse(profileEntry[1]);
	},
	getImsUserId: () => {
		const imsAccessToken = excHelp.getImsAccessToken();
		const tokenDecoded = JSON.parse(atob(imsAccessToken.split('.')[1]));
		return tokenDecoded.user_id;
	},
	getOrgProductContexts: () => {
		return excHelp.getImsProfile().projectedProductContext.reduce((acc, item)=>{ 
			return acc.concat(item.prodCtx);
		}, []);
	},
	getOrgProductContextsByServiceCodeAndService: (serviceCode, service) => {
		return excHelp.getOrgProductContexts().filter(prodCtx=>{ 
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
	getOrgServices: () => {
		return new Set(
			excHelp.getOrgProductContexts().reduce((prodCtxs, prodCtx)=>{ 
				return prodCtxs.concat(prodCtx.services_enabled?.split(',')).concat(prodCtx.enable_sub_service?.split(','));
			}, []).sort()
		);
	},
	hasOrgService: (service) => {
		if (!service) { return false; }
		return Array.from(excHelp.getOrgServices()).includes(service);
	}
}

window.excHelp = excHelp;

console.log('excHelp added', window.excHelp);

//--------------------------------------------------

const reactorHelp = {
	getLensFrame: () => {
		let lensFrame;
		if (window?.environmentSettings?.lens_version) {
			lensFrame = window;
		} else {
			lensFrame = window.top.frames?.[0];
		}

		if (!lensFrame) { console.log('Lens iframe not found.'); }
		return lensFrame?.environmentSettings ? lensFrame: undefined;
	},
	getImsAccessToken: () => {
		let imsAccessToken = reactorHelp.getLensFrame()?.getStore()?.getState()?.globals?.shellPayload?.imsToken
		if (imsAccessToken) { 
			console.log('imsAccessToken found in state.globals.shellPayload.'); 
		}
		else {
			console.log('imsAccessToken not found in shellPayload. Trying to get it from state.ims.');
			imsAccessToken = reactorHelp.getLensFrame().getStore().getState().ims.imsAccessToken;
		}
		return imsAccessToken;
	},
	getImsUserId: () => {
		const imsAccessToken = reactorHelp.getImsAccessToken();
		const tokenDecoded = JSON.parse(atob(imsAccessToken.split('.')[1]));
		return tokenDecoded.user_id;
	},
	getActiveOrgId: () => {
		return reactorHelp.getBlacksmithProfile().attributes.activeOrg;
	},
	getShellPayload: () => {
		return reactorHelp.getLensFrame().getStore().getState().globals.shellPayload;
	},
	getShellImsProfile: () => {
		return reactorHelp.getShellPayload().imsInfo.imsProfile;
	},
	getBlacksmithProfile: () => {
		return reactorHelp.getLensFrame().getStore().getState().ims.profile;
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