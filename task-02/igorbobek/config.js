var variables = ['cfg-chat-title', 'cfg-bot-name', 'cfg-chatURL',
    'cfg-css-class', 'cfg-position', 'cfg-allow-minimize',
    'cfg-allow-drag', 'cfg-require-name', 'cfg-show-date-time',
    'cfg-xhr', 'cfg-fetch'
];
var chatVariables = {
};
var containerForScript;
var containerForUrl;

function showUrl() {
    var url = document.getElementById('cfg-chatURL').value + "?";
    Object.keys(chatVariables).forEach(function f(value) {
        url += value + "=" + chatVariables[value] +'&';
    });
    url = "\n<script src=\"" + url.slice(0, -1) + "\"\n</script>";
    containerForUrl.innerText = url;
}

function showScript() {
    var urlString = document.getElementById('cfg-chatURL').value;
    var variablesStr = JSON.stringify(chatVariables)
        .replace(new RegExp(',', 'g'), ',\n');
    containerForScript.innerText = '\n<script>' + urlString +
        '</script>\n<script>\n' +
        '(function(){\nnew ChatConfig(\n' + variablesStr + ');\n})();' +
        '\n</script>';
}

function showCode(){
    showUrl();
    showScript();
}



function initChatURL(){
   variables.forEach(function fun(element) {
       var elem = document.getElementById(element);
       if(elem.type === 'text'){
           chatVariables[elem.name] = elem.value;
       }else if(elem.type === 'checkbox'){
           chatVariables[elem.name] = elem.checked;
       }else if(elem.type === 'radio'){
           chatVariables.requests =
               document.querySelector('input[name="requests"]:checked').value;
       }else if(elem.type === 'select-one'){
           chatVariables.position = elem.selectedOptions[0].value;
       }
   });
   showCode();
}

document.addEventListener('DOMContentLoaded', function fun(){
    containerForScript = document.getElementById('script');
    containerForUrl = document.getElementById('script-url');
    initChatURL();
    variables.forEach(function f(element) {
        document.getElementById(element).addEventListener('input', function () {
            initChatURL();
        });
    });
});