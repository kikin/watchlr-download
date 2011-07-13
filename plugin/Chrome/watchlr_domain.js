// Inject the watchlr object so that we
// can identify if plugin is installed
// or not
var div = document.createElement('div');
div.id = 'watchlr_dummy_element_for_plugin_detection';
div.style.display = 'hidden';
document.body.appendChild(div);

div.addEventListener('refreshJsUrl', function() {
    alert('Refresh Js URL');
}, false);