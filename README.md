# Adobe Experience Cloud Runtime Helpers
Here are a few runtime JavaScript helpers for Adobe Experience Cloud. After adding them to a website the helpers will be available in the JavaScript console. 

```html
<script src="https://markhicken.github.io/adobe-experience-cloud-runtime-helpers/helpers.js" async="true" />
```
...or...
```javascript
document.addEventListener("DOMContentLoaded", () => {
  const script = document.createElement("script");
  script.src = 'https://markhicken.github.io/adobe-experience-cloud-runtime-helpers/helpers.js';
  script.async = true;
  document.head.appendChild(script);
});
```

A browser extension such as [User JavaScript and CSS](https://chrome.google.com/webstore/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld) can be used to automatically add the script when a an appropriate url such as https://experience.adobe.com is visited. 

## Usage

After the script is added to the page you will see something like the following in your JavaScript console...
```javascript
excHelp added {getImsProfile: ƒ, getOrgProductContexts: ƒ, getOrgProductContextsByServiceCodeAndService: ƒ, getOrgServices: ƒ, hasOrgService: ƒ}

reactorHelp added {getLensFrame: ƒ, getShellPayload: ƒ, getShellFeatureFlags: ƒ, isFeatureFlagTrue: ƒ}
```

You can then call the helper functions directly from the console while visiting Adobe Experience Cloud. 