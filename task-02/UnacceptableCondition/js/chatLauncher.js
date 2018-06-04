var pattern = "touchsoft_chat-launcher_";
var after = [
    "chatTitle", "botName", "chatUrl", "chatClass", "chatPositionSelect",
    "allowMinimize", "allowDrag", "requireName", "showTime", "networkRadioXMR",
    "networkRadioFetch", "scriptCode"
];
var DOMVariables = {};


function createSctipt() {
    var src = "&ltscript src='https://rawgit.com/UnacceptableCondition/Homework_2/master/js/chat.js?title='" +
        DOMVariables.chatTitle.value + "'&botName='" +
        DOMVariables.botName.value + "'&chatUrl='" +
        DOMVariables.chatUrl.value + "'&cssClass='" +
        DOMVariables.chatClass.value + "'&position='" +
        DOMVariables.chatPositionSelect.value + "'&allowMinimize='" +
        DOMVariables.allowMinimize.checked + "'&allowDrag='" +
        DOMVariables.allowDrag.checked + "'&showDateTime='" +
        DOMVariables.showTime.checked + "'&requireName='" +
        DOMVariables.requireName.checked + "'&requests='";
    if(DOMVariables.networkRadioXMR.checked) {
        src += "XMR'";
    } else {
        src += "fetch''&gt&lt/script&gt";
    }
    DOMVariables.scriptCode.innerHTML = src;
}

after.map(function setDomElements (element) {
    DOMVariables[element] = document.getElementById(pattern + element);
    DOMVariables[element].addEventListener("change", function changeElement () {
        createSctipt();
    });
    return true;
});
