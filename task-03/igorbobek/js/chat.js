/* exported variableName */

"use-strict";

var style =
    ".igorbobek-my-chat {" +
    "width: 400px;" +
    "height: max-content;" +
    "border: 1px solid #e4e4e4;" +
    "position: fixed;" +
    "right: 0px;" +
    "bottom: 0px;" +
    "background-color: #000000b3;" +
    "border-radius: 12px;" +
    "padding: 4px;" +
    "z-index = 9999;" +
    "display: table;" +
    "}" +
    ".igorbobek-content {" +
    "height: 200px;" +
    "margin-top: 36px;" +
    "width: 100%;" +
    "background: #fff;" +
    "border-radius: 14px;" +
    "text-align: center;" +
    "font-size: 30px;" +
    "overflow-y: auto;" +
    "}" +
    ".igorbobek-minimizer {" +
    "border: none;" +
    "float: right;" +
    "width: 30px;" +
    "height: 30px;" +
    "border-radius: inherit;" +
    "font-family: cursive;" +
    "font-size: larger;" +
    "}" +
    ".igorbobek-mini h4 {" +
    "display: contents;" +
    "}" +
    ".igorbobek-message-box {" +
    "height: 50px;" +
    "width: 70%;" +
    "background: white;" +
    "border-radius: 12px;" +
    "margin-top: 100px;" +
    "bottom: 4px;" +
    "resize: none;" +
    "overflow: auto;" +
    "padding: 8px;" +
    "}" +
    ".igorbobek-send {" +
    "float: right;" +
    "border: none;" +
    "position: absolute;" +
    "bottom: 14px;" +
    "right: 10px;" +
    "border-radius: 6px;" +
    "height: 30px;" +
    "background: #aef5ff;" +
    "}" +
    ".igorbobek-icon-chat {" +
    "margin-top: 23px;" +
    "position: absolute;" +
    "top: -40px;" +
    "height: fit-content;" +
    "left: 38px;" +
    "background: #dddddd;" +
    "border-radius: 11px;" +
    "padding: 7px;" +
    "font-variant: small-caps;" +
    "color: #4c4c4c;" +
    "}" +
    ".igorbobek-message {" +
    "text-align: left;" +
    "font-style: italic;" +
    "font-size: 18px;" +
    "padding: 7px;" +
    "margin-top: 4px;" +
    "background: #b2cdff;" +
    "border-radius: 18px;" +
    "}" +
    ".igorbobek-require-input {" +
    "border-radius: 12px;" +
    "align-items: center;" +
    "resize: none;" +
    "padding: 8px;" +
    "}" +
    ".igorbobek-require-button {" +
    "border: none;" +
    "border-radius: 6px;" +
    "height: 30px;" +
    "margin-left: 12px;" +
    "background: #aef5ff;" +
    "}" +
    ".igorbobek-content form div {" +
    "display: flow-root;" +
    "}";

var srcScript = document.currentScript.src;
var buttonMinimilizer = null;
var containerForChat = document.body;
var container = null;
var sendButton = null;
var messageBox = null;
var mainDiv = null;
var iconChat = null;
var content = null;
var ChatInstance;
var User;
var APIKEY = "AIzaSyBe3_RAaK7fpdSDYduyembKk0iutBpNXJQ";
var HEADER_JSON = {
    Accept: "application/json",
    "Content-Type": "application/json"
};
var HEADER_URLENCODE = {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded"
};
var urlForCreatingNewUser =
    "https://www.googleapis.com" +
    "/identitytoolkit/v3/" +
    "relyingparty/signupNewUser?key=" +
    APIKEY;
var apiRefreshToken =
    "https://securetoken.googleapis.com" + "/v1/token?key=" + APIKEY;

/* exported ChatConfig */
var ChatConfig = function f(cfg) {
    if (cfg !== undefined) {
        ChatInstance.getInstance().initConfig(cfg);
    }
};

/* exported fetchRequst */
function fetchRequst(path, method, data, headers) {
    return fetch(path, {
        method: method,
        headers: headers,
        body: data
    }).then(function f(response) {
        return response.status !== 200 ? undefined : response.json();
    });
}

/* exported xhrRequest */
function xhrRequest(url, method, data, headers) {
    return new Promise(function fun(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);

        if (headers !== "") {
            Object.keys(headers).forEach(function f(key) {
                xhr.setRequestHeader(key, headers[key]);
            });
        }
        xhr.onload = function onload() {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        };

        xhr.onerror = function onerror() {
            reject(xhr.statusText);
        };
        xhr.send(data);
    }).then(function returnData(dataForParse) {
        return JSON.parse(dataForParse);
    });
}

function encodeURI(data) {
    var query = "";
    var i;
    for (i = 0; i < Object.keys(data).length; i += 1) {
        query +=
            encodeURIComponent(Object.keys(data)[i]) +
            "=" +
            encodeURIComponent(data[Object.keys(data)[i]]) +
            "&";
    }
    return query;
}

function saveObjectToLocalStorage(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
}

function getObjectFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

User = function() {
    this.name = undefined;
    this.accessToken = undefined;
    this.userId = undefined;
    this.refreshToken = undefined;
    this.tokenId = undefined;
    this.isAuthenticated = false;
};

User.prototype.initUser = function initUser(jsonData) {
    this.userId = jsonData.user_id;
    this.accessToken = jsonData.access_token;
    this.name = this.name || this.userId;
    this.refreshToken = jsonData.refresh_token;
    this.tokenId = jsonData.id_token;
    this.isAuthenticated = true;
};

User.prototype.saveToFirebase = function saveToFirebase() {
    var request = ChatInstance.getInstance().makeRequest;
    request(
        ChatInstance.getInstance().config.chatUrl +
        "users/" +
        this.userId +
        ".json?auth=" +
        this.tokenId,
        "PUT",
        JSON.stringify(this),
        HEADER_JSON
    );
};

User.prototype.init = function userInit() {
    var that = this;
    var request = ChatInstance.getInstance().makeRequest;
    var userFromLS = getObjectFromLocalStorage("user");

    function refreshToken(token) {
        request(
            apiRefreshToken,
            "POST",
            encodeURI({
                grant_type: "refresh_token",
                refresh_token: token
            }),
            HEADER_URLENCODE
        ).then(function initUser(result) {
            that.initUser(result);
            saveObjectToLocalStorage("user", that);
            that.saveToFirebase();
            ChatInstance.getInstance().recovery();
        });
    }

    if (userFromLS) {
        refreshToken(userFromLS.refreshToken);
    } else {
        (function createUser(callback) {
            request(urlForCreatingNewUser, "POST", "", HEADER_JSON).then(function f(
                data
            ) {
                callback.call(this, data.refreshToken);
            });
        })(refreshToken);
    }
};

function Chat() {
    this.config = undefined;
    this.user = new User();

    this.setConfigFromSrcScript();
}

Chat.prototype.setConfigFromSrcScript = function f() {
    var parameters = {};
    var parameterStr;
    var parametersString = srcScript.split("?")[1];
    if (parametersString !== undefined) {
        parametersString.split("&").forEach(function fun(value) {
            parameterStr = value.split("=");

            if (parameterStr[1] === "true") {
                parameterStr[1] = true;
            } else if (parameterStr[1] === "false") {
                parameterStr[1] = false;
            } else {
                parameterStr[1] = decodeURI(parameterStr[1]);
            }

            parameters[parameterStr[0]] = parameterStr[1];
        });
        this.initConfig(parameters);
    }
};

Chat.prototype.initConfig = function f(cfg) {
    this.config = cfg;
    this.countUnreadMessages = 0;
};

Chat.prototype.setTitle = function f(newTitle) {
    iconChat.innerText = decodeURI(newTitle || this.config.title);
};

Chat.prototype.minimizeContent = function f(event) {
    var minimize;
    if (ChatInstance.getInstance().config.allowMinimize) {
        minimize = getObjectFromLocalStorage('minimize');
        container.hidden = minimize === null ? true : minimize;

        if (event && event.type === "click") {
            saveObjectToLocalStorage('minimize',!container.hidden);
            container.hidden = !container.hidden;
        }

        if (!container.hidden) {
            buttonMinimilizer.innerHTML = "-";
        } else {
            buttonMinimilizer.innerHTML = "+";
        }

        saveObjectToLocalStorage('minimize',container.hidden);
    }
};

Chat.prototype.setAllowMinimize = function f1(flag) {
    this.config.allowMinimize = flag;
    if (flag) {
        buttonMinimilizer = document.createElement("button");
        buttonMinimilizer.classList.add("igorbobek-minimizer");
        mainDiv.prepend(buttonMinimilizer);
        buttonMinimilizer.addEventListener("click", function min(event) {
            ChatInstance.getInstance().minimizeContent(event);
        });
        this.minimizeContent();
    } else if (buttonMinimilizer !== null && !flag) {
        buttonMinimilizer.remove();
    }
};

Chat.prototype.setPosition = function f(position) {
    if (position === "left") {
        mainDiv.style.left = "0px";
    }
};

Chat.prototype.setCssClass = function f(className) {
    mainDiv.classList = className;
};

Chat.prototype.addRequireContainer = function addRequireContainer(callback) {
    var saveContent = content.innerHTML;
    var requireButton = document.createElement("button");
    var requireInput = document.createElement("input");
    var requireForm = document.createElement("form");
    var requireDiv = document.createElement("div");
    var requireTitle = document.createElement("h3");

    requireForm.setAttribute("onsubmit", "return false;");
    content.appendChild(requireForm);

    requireTitle.innerText = "Введите имя";
    requireDiv.appendChild(requireTitle);

    requireInput.classList.add("igorbobek-require-input");
    requireDiv.appendChild(requireInput);

    requireButton.classList.add("igorbobek-require-button");
    requireButton.innerHTML = "Submit";

    requireButton.addEventListener("click", function f() {
        ChatInstance.getInstance().user.name = requireInput.value;
        content.innerHTML = saveContent;
        callback.call(ChatInstance.getInstance());
    });

    requireDiv.appendChild(requireButton);

    requireForm.appendChild(requireDiv);
};

Chat.prototype.requireName = function f(flag, callback) {
    if (flag) {
        this.addRequireContainer(callback);
    } else {
        callback.call(this);
    }
};

Chat.prototype.setRequestMethod = function setRequestMethod(type) {
    if (type === "fetch") {
        this.makeRequest = fetchRequst;
    } else if (type === "xhr") {
        this.makeRequest = xhrRequest;
    }
};

Chat.prototype.initChatConfiguration = function f() {
    this.setTitle(this.config.title);
    this.setAllowMinimize(this.config.allowMinimize);
    this.setPosition(this.config.position);
    this.setCssClass(this.config.cssClass);
    this.setRequestMethod(this.config.requests);
    this.requireName(this.config.requireName, function continueInit() {
        this.initListeners();
        this.user.init(this.user);
    });
};

Chat.prototype.makeRequest = fetchRequst;

ChatInstance = (function fun() {
    var instance;

    function createInstance() {
        return new Chat();
    }

    return {
        getInstance: function f() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

function Message(name, message, time) {
    this.name = name;
    this.message = message;
    this.time = time;
}


Message.prototype.saveMessage = function saveMessage() {
    var chat = ChatInstance.getInstance();
    this.sender = ChatInstance.getInstance().user.userId;
    chat.makeRequest(
        chat.config.chatUrl +
        "/chatMessages/" +
        getObjectFromLocalStorage("chat").name +
        ".json?auth=" +
        chat.user.tokenId,
        "POST",
        JSON.stringify(this),
        HEADER_JSON
    ).then(function saveTime() {
        var chatObjectForSave = {};
        chatObjectForSave.lastMessageTime = new Date().getTime();
        chat.makeRequest(
            chat.config.chatUrl +
            "/chats/" +
            getObjectFromLocalStorage("chat").name +
            ".json?auth=" +
            chat.user.tokenId,
            "PUT",
            JSON.stringify(chatObjectForSave),
            HEADER_JSON
        )
    });
};

Message.prototype.getTimeForMessage = function f() {
    var time;
    var options = { hour: "numeric", second: "numeric", minute: "numeric" };
    if (ChatInstance.getInstance().config.showDateTime) {
        time = new Date(this.time).toLocaleString("ru-RU", options);
    } else {
        time = "";
    }
    return time;
};

Message.prototype.sendMessage = function f() {
    var messageDiv;
    if (!(this.message === "")) {
        messageDiv = document.createElement("div");
        messageDiv.innerHTML =
            this.getTimeForMessage() + " " + this.name + ":<br>" + this.message;
        messageDiv.classList.add("igorbobek-message");
        content.appendChild(messageDiv);
    }
};

Chat.prototype.recoveryMessages = function f() {
    var chatId = getObjectFromLocalStorage("chat").name;
    function compareMessage(first, second) {
        var result;
        var a = first.time;
        var b = second.time;
        if (a > b) {
            result = 1;
        } else if (a < b) {
            result = -1;
        } else {
            result = 0;
        }
        return result;
    }

    fetchRequst
        .call(
            this,
            this.config.chatUrl +
            "chatMessages/" + chatId +
            ".json?" +
            "&auth=" +
            this.user.tokenId,
            "GET",
            undefined,
            HEADER_JSON
        )
        .then(function shopMessages(result) {
            var messages = [];

            if (result) {
                content.innerHTML ='';
                Object.keys(result).forEach(function showMessage(key) {
                    var messageObj = result[key];
                    var message = new Message(
                        messageObj.name,
                        messageObj.message,
                        messageObj.time
                    );
                    messages.push(message);
                });
            };
            messages.sort(compareMessage).forEach(function send(message) {
                message.sendMessage();
            });
        });
};

Chat.prototype.initStyle = function f() {
    var styles = document.createElement("style");
    styles.innerHTML = style;
    document.body.appendChild(styles);
};


function listenerSendButton() {
    var message = new Message(
        ChatInstance.getInstance().user.name,
        messageBox.value.replace(new RegExp("\\n", "g"), "<br>"),
        new Date().getTime()
    );
    message.sendMessage();
    message.saveMessage();
}

function getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + window.pageYOffset,
        left: box.left + window.pageXOffset
    };
}

Chat.prototype.dragAndDrop = function f(e) {
    var coordinates = getCoords(mainDiv);
    var shiftX = e.pageX - coordinates.left;
    var shiftY = e.pageY - coordinates.top;

    function moveAt(event) {
        mainDiv.style.left = event.pageX - shiftX + "px";
        mainDiv.style.top = event.pageY - shiftY + "px";
    }

    moveAt(e);

    document.onmousemove = function move(event) {
        moveAt(event);
    };
};

Chat.prototype.positioningChat = function positioningChat() {
    var rect = mainDiv.getBoundingClientRect();
    mainDiv.removeAttribute("style");

    if (rect.top + rect.height / 2 < window.innerHeight / 2) {
        mainDiv.style.top = "18px";
    } else {
        mainDiv.style.bottom = "0px";
    }

    if (rect.left + rect.width / 2 < window.innerWidth / 2) {
        mainDiv.style.left = "0px";
    } else {
        mainDiv.style.right = "0px";
    }
};

Chat.prototype.initListeners = function f() {
    var messagesScrollDown = function fun() {
        content.scrollTo(0, content.scrollHeight);
    };
    sendButton.addEventListener("click", listenerSendButton);

    content.addEventListener("DOMSubtreeModified", messagesScrollDown);

    if (this.config.allowDrag === true) {
        iconChat.addEventListener(
            "mousedown",
            ChatInstance.getInstance().dragAndDrop
        );

        iconChat.addEventListener("mouseup", function clear() {
            document.onmousemove = null;
            mainDiv.onmouseup = null;
            ChatInstance.getInstance().positioningChat();
        });
    }
};

Chat.prototype.createChatFirebase = function createChatFirebase(callback) {
    var chat = ChatInstance.getInstance();
    this.makeRequest(
        chat.config.chatUrl + "chats.json?" + "&auth=" + chat.user.tokenId,
        "POST",
        JSON.stringify({
            members: [chat.user.userId]
        }),
        HEADER_JSON
    ).then(function f(result) {
        saveObjectToLocalStorage("chat", result);
        chat.makeRequest(
            chat.config.chatUrl + "userChat/" + chat.user.userId
            + ".json?" + "&auth=" + chat.user.tokenId,
            "PUT",
            JSON.stringify([getObjectFromLocalStorage("chat").name]),
            HEADER_JSON
        ).then(function call() {
            callback.call(chat);
        });
    });
};

Chat.prototype.connectToChatFirebase = function connectToChatFirebase() {
    if (getObjectFromLocalStorage("chat") == null) {
        this.createChatFirebase(this.recoveryMessages);
    } else {
        this.recoveryMessages();
    }
};

Chat.prototype.recovery = function recovery() {
    this.connectToChatFirebase();
};

Chat.prototype.drawChat = function f() {
    var form;

    mainDiv = document.createElement("div");
    mainDiv.classList.add("igorbobek-my-chat");
    containerForChat.appendChild(mainDiv);

    iconChat = document.createElement("h3");
    iconChat.classList.add("igorbobek-icon-chat");
    mainDiv.appendChild(iconChat);

    container = document.createElement("div");
    container.classList.add("igorbobek-chat-container");
    mainDiv.appendChild(container);

    content = document.createElement("div");
    content.classList.add("igorbobek-content");
    container.appendChild(content);

    form = document.createElement("form");
    form.setAttribute("onsubmit", "return false;");
    container.appendChild(form);

    messageBox = document.createElement("textarea");
    messageBox.classList.add("igorbobek-message-box");
    form.appendChild(messageBox);

    sendButton = document.createElement("button");
    sendButton.classList.add("igorbobek-send");
    sendButton.innerHTML = "Отправить";
    form.appendChild(sendButton);
};

Chat.prototype.update = function update(){
    this.recoveryMessages();
};

Chat.prototype.init = function f() {
    this.initStyle();
    this.drawChat();
    this.initChatConfiguration();
    setInterval(function update(){
        ChatInstance.getInstance().update();
        }, 2000);
};

/* exported createChat */
function createChat() {
    ChatInstance.getInstance().init();
}

/* global AdminChat */
document.addEventListener('DOMContentLoaded', function creatingChat() {
    if (typeof AdminChat === 'undefined'){
        containerForChat = document.body;
        createChat();
    }
});

