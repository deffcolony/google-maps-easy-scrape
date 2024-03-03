function getBrowserTheme() { return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
document.addEventListener('DOMContentLoaded', function() { document.body.setAttribute('theme', getBrowserTheme()); });
function setTheme(theme) { document.body.setAttribute('theme', theme == 'system' ? getBrowserTheme() : theme); }