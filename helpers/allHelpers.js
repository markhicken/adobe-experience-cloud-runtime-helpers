const helperPaths = [
  './excHelp.js',
  './reactorHelp.js'
];

document.addEventListener('DOMContentLoaded', () => {
  helperPaths.forEach(helperPath=>{
    const script = document.createElement('script');
    script.src = helperPath;
    script.async = true;
    document.head.appendChild(script);
  });
});