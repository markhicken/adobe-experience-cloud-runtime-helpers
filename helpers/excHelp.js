class excHelp {
	getImsProfile() {
		const profileEntry = Object.entries(sessionStorage).find(
			item => item[0].indexOf('adobeid_ims_profile') === 0
		);
		// console.log('Found profile entry for: ', profileEntry[0]);
		return JSON.parse(profileEntry[1]);
	}
	
	getOrgProductContexts(orgId) {
		return this.getImsProfile().projectedProductContext.reduce((acc, item)=>{ 
			return acc.concat(item.prodCtx);
		}, []);
	}
	
	getOrgProductContextsByServiceCodeAndService(serviceCode, service, orgId) {
		return this.getOrgProductContexts(orgId).filter(prodCtx=>{ 
			if (service) {
					return prodCtx.serviceCode === serviceCode && (
						prodCtx.services_enabled?.split(',').includes(service) ||
						prodCtx.enable_sub_service?.split(',').includes(service)
					);
			} else {
				return prodCtx.serviceCode === serviceCode;
			}
		});
	}

	getOrgServices(orgId) {
		return new Set(
			this.getOrgProductContexts(orgId).reduce((prodCtxs, prodCtx)=>{ 
				return prodCtxs.concat(prodCtx.services_enabled?.split(',')).concat(prodCtx.enable_sub_service?.split(','));
			}, []).sort()
		);
	}

	hasOrgService(service, orgId) {
		if (!service) { return false; }
		return Array.from(this.getOrgServices(orgId)).includes(service);
	}
}

window.excHelp = new excHelp();

console.log('excHelp added', window.excHelp);
