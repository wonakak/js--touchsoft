/* exported sendMessage showFeedback hideFeedback */
function generateCollapsedFeedback() {
    var collapsedFeedback = document.createElement("div");
    collapsedFeedback.id = "elemShowFeedback";
    collapsedFeedback.className = "collapsedFeedback";
    collapsedFeedback.innerHTML =
        "<form><input type='text' id='messageArea'><input type='button' id='sendMessageButton' value='Send Message'><input type='button' value='<<' id='maximize'></form>";
    return collapsedFeedback;
}

function checkTime(time) {
    var currentTime = time;
    if (currentTime < 10) {
        currentTime = "0".concat(time);
    }
    return currentTime;
}

function generateFeedback() {
    var container = document.createElement("container");
    container.id = "feedBack";
    container.className = "feedBack";
    container.innerHTML =
        "<form><input type='button' value='>>' id='collapse'><p><textarea id='messageHistory' rows=\"8\" cols=\"30\" name=\"text\" disabled>" +
        '</textarea></p><textarea id=\'messageArea\' rows="3" cols="30" name="text"></textarea>' +
        "<br></ber><input type='button' id='sendMessageButton' value='Send Message'></form>";
    return container;
}


function getReplyForMessage(message) {
    return function replyToMessage() {
        var messageHistory = localStorage.getItem("message");
        var date = new Date();
        var minute = checkTime(date.getMinutes());
        var hour = checkTime(date.getHours());
        messageHistory = messageHistory.concat("\n".concat([hour, minute].join(":").concat(" Bot: Response to '".concat(message.concat("'")))));
        if (document.getElementById("messageHistory")) {
            document.getElementById("messageHistory").value = messageHistory;
        }
        localStorage.setItem("message", messageHistory);
    };
}


function sendMessage() {
    var messageArea = document.getElementById("messageArea");
    var message = localStorage.getItem("message");
    var messageHistory;
    var timeOut = 15000;
    var date = new Date();
    var minute = checkTime(date.getMinutes());
    var hour = checkTime(date.getHours());
    if (message) {
        messageHistory = message;
    } else {
        messageHistory = "";
        localStorage.setItem("message", messageHistory);
    }
    message = messageArea.value;
    messageHistory = messageHistory.concat("\n".concat([hour, minute].join(":").concat(" You: ".concat(message))));
    messageArea.value = "";
    if (document.getElementById("messageHistory")) {
        document.getElementById("messageHistory").value = messageHistory;
    }
    localStorage.setItem("message", messageHistory);
    setTimeout(getReplyForMessage(message), timeOut);
}

function showFeedback() {
    var bodyElement = document.body;
    var elem;
    var changeElem = document.getElementById("elemShowFeedback");
    bodyElement.replaceChild(generateFeedback(), changeElem);
    elem  = document.getElementById("messageHistory");
    localStorage.setItem("isOpen", "feedBack");
    elem.value = localStorage.getItem("message");
    document.getElementById("collapse").addEventListener("click", function hide () {
        changeElem = document.getElementById("feedBack");
        bodyElement.replaceChild(generateCollapsedFeedback(), changeElem);
        localStorage.setItem("isOpen", "button");
        document.getElementById("sendMessageButton").addEventListener("click",sendMessage);
        document.getElementById("maximize").addEventListener("click", showFeedback)
    });
    document.getElementById("sendMessageButton").addEventListener("click",sendMessage);
}

function hideFeedback() {
    var bodyElement = document.body;
    var changeElem = document.getElementById("feedBack");
    bodyElement.replaceChild(generateCollapsedFeedback(), changeElem);
    localStorage.setItem("isOpen", "button");
    document.getElementById("sendMessageButton").addEventListener("click",sendMessage);
    document.getElementById("maximize").addEventListener("click", function show() {
        var elem;
        changeElem = document.getElementById("elemShowFeedback");
        bodyElement.replaceChild(generateFeedback(), changeElem);
        elem  = document.getElementById("messageHistory");
        localStorage.setItem("isOpen", "feedBack");
        elem.value = localStorage.getItem("message");
        document.getElementById("collapse").addEventListener("click",hideFeedback);
        document.getElementById("sendMessageButton").addEventListener("click",sendMessage);
    });
}

function createFeedback() {
    var bodyElement = document.body;
    var elem ;
    var message;
    bodyElement.appendChild(generateFeedback());
    elem = document.getElementById("messageHistory");
    message = localStorage.getItem("message");
    elem.value = message;
    document.getElementById("collapse").addEventListener("click",hideFeedback);
    document.getElementById("sendMessageButton").addEventListener("click",sendMessage);
}

function setStyle() {
    var titleElem = document.head;
    var styleElem = document.createElement("link");
    styleElem.setAttribute("rel","stylesheet");
    styleElem.setAttribute("href","../CSS/styles.css");
    styleElem.setAttribute("type","text/css");
    styleElem.setAttribute("media","screen");
    titleElem.appendChild(styleElem);
}

setStyle();



function createCollapsedFeedback() {
    var bodyElement = document.body;
    bodyElement.appendChild(generateCollapsedFeedback());
    document.getElementById("sendMessageButton").addEventListener("click",sendMessage);
    document.getElementById("maximize").addEventListener("click",showFeedback);
}


function checkWindow() {
    var isOpen = localStorage.getItem("isOpen");
    if ( isOpen != null ) {
        if (isOpen === "feedBack") {
            createFeedback();
        } else {
            createCollapsedFeedback();
        }
    } else {
        localStorage.setItem("isOpen", "button");
        createCollapsedFeedback();
    }
}

window.onload = function check() {
    checkWindow();
};











