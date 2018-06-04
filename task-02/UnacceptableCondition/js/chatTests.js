/* global document */
/* global localStorage */
/* global XMLHttpRequest */
/* global QUnit */
var testHtml;
var setupObject;
var dataBaseObject;
var configObj = {
    messageFromBot: " Bot: Ответ на ",
    messageFromUser: " Вы : ",
    timeOfBotResponse: 10000,
    localStorageName: "userName_touchsoft",
    defaultDbURL: "https://touchsoftchatproject.firebaseio.com",
    pathToHtmlFile:
        "https://rawgit.com/UnacceptableCondition/Homework_2/master/html/chat.html",
    pathToCssFile:
        "https://rawgit.com/UnacceptableCondition/Homework_2/master/css/chat.css",
    isMinimize: false,
    userData: {
        userName: "",
        online: "",
        read: "",
        isMinimize: false
    },
    scriptSrc: document.currentScript.getAttribute("src"),
    appDOMVariables: {
        messagesBlock: { className: "root_chat_for_touchsoft__top_messages" },
        minimizeStyleChatBlock: {
            className: "root_chat_for_touchsoft_minimize-style"
        },
        mainStyleChatBlock: { className: "root_chat_for_touchsoft" },
        mainSendButton: {
            className: "root_chat_for_touchsoft__bottom_send-button"
        },
        minimizeSendButton: {
            className: "root_chat_for_touchsoft_minimize-style__send-button"
        },
        setMinimizeStyleButton: {
            className: "root_chat_for_touchsoft__top_minimize-button"
        },
        setMaxStyleButton: {
            className: "root_chat_for_touchsoft_minimize-style__max-button"
        },
        messagesTextArea: { className: "root_chat_for_touchsoft__textarea" },
        messagesInput: {
            className: "root_chat_for_touchsoft_minimize-style__message-input"
        },
        userNameInput: {
            className: "root_chat_for_touchsoft_input-name"
        },
        userNameButton: {
            className: "root_chat_for_touchsoft_input-name-button"
        },
        userNameBlock: {
            className: "root_chat_for_touchsoft_input-name-block"
        },
        titleBlock: {
            className: "root_chat_for_touchsoft-title"
        }
    },

    historyMessages: []
};

var chatForTouchSoftInstance;
// localStorage.removeItem(configObj.localStorageName);

// OBJECT FOR WORK WITH USER SETTINGS // BEGIN //

function SetupObject(configObject) {
    this.config = configObject;
}

SetupObject.prototype.setupUserSettings = function setupUserSettings() {
    this.setMessageFromBot();
    this.allowMinimize();
    this.setPositionOfMainBlock();
    this.setTitle();
    this.setMainCssClass();
    this.allowDragNDrop();
};

SetupObject.prototype.parseSrcForParameters = function parseSrcForParameters(
    src
) {
    var userConfigObject = {};
    var arrParam = src.substr(src.indexOf("?") + 1).split("&");
    arrParam.forEach(function createConfigObj (element) {
        var paramObj = element.split("=");
        paramObj[1] = paramObj[1].replace(/'/g, "");
        userConfigObject[paramObj[0]] = paramObj[1];
    });
    return userConfigObject;
};

SetupObject.prototype.setMessageFromUser = function setMessageFromUser() {
    this.config.messageFromUser = this.config.userData.userName
        ? " " + this.config.userData.userName + " : "
        : " Вы : ";
};

SetupObject.prototype.setMessageFromBot = function setMessageFromBot() {
    this.config.messageFromBot = this.config.userSettings.botName
        ? " " + this.config.userSettings.botName + ": Ответ на "
        : " Bot: Ответ на ";
};

SetupObject.prototype.allowDragNDrop = function allowDragNDrop() {
    var clickBlock = this.config.appDOMVariables.titleBlock;
    var dragBlock = this.config.appDOMVariables.mainStyleChatBlock;
    if (this.config.userSettings.allowDrag === "false") {
        return;
    }
    clickBlock.addEventListener("mousedown", function dragAndDrop(e) {
        var cords;
        var shiftX;
        var shiftY;
        var moveObj;
        var setNull;
        var endDrag;

        function getCoords(elem) {
            var box = elem.getBoundingClientRect();
            return {
                top: box.top + window.pageYOffset,
                left: box.left + window.pageXOffset
            };
        }

        cords = getCoords(dragBlock);
        shiftX = e.pageX - cords.left;
        shiftY = e.pageY - cords.top;

        function moveAt(elem) {
            dragBlock.style.left = elem.pageX - shiftX + "px";
            dragBlock.style.top = elem.pageY - shiftY + "px";
        }

        moveObj = function moveObjDragAndDrop(elem) {
            moveAt(elem);
        };

        setNull = function setNullDragAndDrop () {
            document.removeEventListener("mousemove",moveObj );
            document.removeEventListener("mouseup",setNull );
        };

        endDrag = function endDragAndDrop() {
            return false;
        };

        moveAt(e);
        dragBlock.style.zIndex = 1000;

        document.addEventListener("mousemove", moveObj);
        document.addEventListener("mouseup", setNull);
        dragBlock.addEventListener("dragstart", endDrag);

    });
};

SetupObject.prototype.setPositionOfMainBlock = function setPositionOfMainBlock() {
    if (this.config.userSettings.position === "right") {
        this.config.appDOMVariables.mainStyleChatBlock.classList.add(
            "root_chat_for_touchsoft_right-position"
        );
    } else {
        this.config.appDOMVariables.mainStyleChatBlock.classList.add(
            "root_chat_for_touchsoft_left-position"
        );
    }
};

/**
 * Init shat style on the first load or reload page
 */
SetupObject.prototype.setupChatStyle = function setupChatStyle() {
    if (!this.config.userData.isMinimize) {
        this.config.appDOMVariables.mainStyleChatBlock.classList.toggle(
            "invisible"
        );
    } else {
        this.config.appDOMVariables.minimizeStyleChatBlock.classList.toggle(
            "invisible"
        );
    }
};

SetupObject.prototype.setTitle = function setTitle() {
    if(!this.config.userSettings.title) {
        this.config.userSettings.title = "TouchSoft Chat";
    }
    this.config.appDOMVariables.titleBlock.innerHTML = this.config.userSettings.title;
};

SetupObject.prototype.allowMinimize = function allowMinimize() {
    if (this.config.userSettings.allowMinimize === "false") {
        this.config.appDOMVariables.setMinimizeStyleButton.classList.add(
            "invisible"
        );
    }
};

SetupObject.prototype.setMainCssClass = function setMainCssClass() {
    if(!this.config.userSettings.cssClass) {
        this.config.userSettings.cssClass = 'touchsoft-chat_main-block';
    }
    this.config.appDOMVariables.mainStyleChatBlock.parentNode.classList.add(
        this.config.userSettings.cssClass
    );
};

/**
 * Gets access to chat DOM elements and writes them in appDOMVariables
 * object instead object which it contains
 *
 * @param {Array|Object} appDOMVariables array of classes DOM elements to which you wants to access
 * array element is object with string property "className"
 */
SetupObject.prototype.setupDOMVariables = function setupDOMVariables(
    appDOMVariables
) {
    var newAppDOMVariables = {};
    Object.keys(appDOMVariables).map(function setElementsAccess(objectKey) {
        newAppDOMVariables[objectKey] = document.getElementsByClassName(
            appDOMVariables[objectKey].className
        )[0];
        return true;
    });
    chatForTouchSoftInstance.config.appDOMVariables = newAppDOMVariables;
};

SetupObject.prototype.userNameIsRequire = function userNameIsRequire() {
    if (!this.config.hashUserName) {
        if (this.config.userSettings.requireName === "true") {
            this.config.appDOMVariables.userNameBlock.classList.toggle("invisible");
            return true;
        }
        return false;

    }
    return true;
};

// WORK WITH USER SETTINGS // END //

// WORK WITH DATABASE // BEGIN //

function DataBaseObject(typeOfRequest, dataBaseUrl, configObject) {
    this.config = configObject;
    this.setup(typeOfRequest);
    this.dbURL = dataBaseUrl + "/users/";
}

DataBaseObject.prototype.setup = function setup(typeOfRequest) {
    if (typeOfRequest === "fetch") {
        DataBaseObject.prototype.saveUserMessage = this.requestFetch;
        DataBaseObject.prototype.saveUserSettings = this.requestFetch;
        DataBaseObject.prototype.getUserSettings = this.requestFetch;
        DataBaseObject.prototype.getUserMessages = this.requestFetch;
    } else {
        DataBaseObject.prototype.saveUserMessage = this.requestXMR;
        DataBaseObject.prototype.saveUserSettings = this.requestXMR;
        DataBaseObject.prototype.getUserSettings = this.requestXMR;
        DataBaseObject.prototype.getUserMessages = this.requestXMR;

    }
};

DataBaseObject.prototype.requestXMR = function requestXMR (postfixUrl, body, requestType) {
    var url = this.dbURL;
    return new Promise(function request (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(requestType, url + postfixUrl, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function loadCase() {
            resolve(JSON.parse(xhr.response));
        };
        xhr.onerror = function errorCase() {
            reject(xhr.statusText);
        };
        if(body) {
            xhr.send(body);
        } else {
            xhr.send();
        }
    });
};

DataBaseObject.prototype.requestFetch = function requestFetch (postfixUrl, body, requestType) {
    return fetch(
        this.dbURL + postfixUrl,
        {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: requestType,
            body: body
        }
    )
        .then(function getResponseJSON (response) {
            return response.json();
        })
        .then(function getResponseData (data) {
            return data;
        });
};

DataBaseObject.prototype.testRequest = function testRequest () {
    var dbObjectRef = this;
    return new Promise(function testPromise(resolve) {
        var response = dbObjectRef.getUserSettings(dbObjectRef.config.hashUserName + "/settings.json", null, 'GET');
        response.then(function test (data) {
            if(data) {
                if (data.error === "404 Not Found") {
                    dbObjectRef.dbURL = dbObjectRef.config.defaultDbURL + "/users/";
                }
            } else {
                localStorage.removeItem(dbObjectRef.config.localStorageName);
                dbObjectRef.config.hashUserName = null;
            }
            return resolve();
        });
    });
};

// WORK WITH DATABASE  // END //

function ChatForTouchSoft(configObject) {
    this.config = configObject;
    this.setupObject = new SetupObject(configObject);
    this.dataBaseObject = {};
}

// Enter point
ChatForTouchSoft.prototype.startApp = function startApp() {
    var cssLink = this.createCSSLink(
        this.config.pathToCssFile,
        "stylesheet",
        "text/css",
        "touch-soft-chat-css"
    );
    var callbackLoad = function callbackLoad(requestObj) {
        this.includeHTML(document.body, requestObj.response);
        this.setupAppConfiguration();
    };
    this.includeCSS(cssLink);
    this.getHTML(this.config.pathToHtmlFile, callbackLoad);
};

// Invokes all setup functions, gets history of messages and display it
ChatForTouchSoft.prototype.setupAppConfiguration = function setupAppConfiguration() {
    this.setupObject.setupDOMVariables(this.config.appDOMVariables);
    this.applyUserSettings();
    this.setupOnClickFunctions();
};

ChatForTouchSoft.prototype.applyUserSettings = function applyUserSettings() {
    var chatObj = this;
    this.config.hashUserName = this.getUserNameFromLocalStorage();
    this.config.userSettings = this.setupObject.parseSrcForParameters(
        this.config.scriptSrc
    );
    this.dataBaseObject = new DataBaseObject(this.config.userSettings.requests, this.config.userSettings.chatUrl, this.config);
    // Проверяем соединение с БД по адресу пользователя. if status 404 подставляем адрес стандартной бд
    this.dataBaseObject.testRequest().then( function testDataBase () {
        // Если хэша нет в localStorage и/или авторизация не обязательна = установить имя пользователя по умолчанию
        if (!chatObj.setupObject.userNameIsRequire()) {
            chatObj.setUserName();
        }
        // Применить настройки чата переданные как GET параметры в ссылке скрипта
        chatObj.setupObject.setupUserSettings();
        /*
            Если hashUserName был сохранен в LocalStorage - загружаем его данные с сервера: имя юзера(не хэш), мессаджи и стиль окна (min max)
            в противном случае применяем базовые настройки стиля
          */
        if (chatObj.isHashUserName()) {
            chatObj.getUserData();
        } else {
            chatObj.setupObject.setupChatStyle();
        }
    });
};

// callback for case: name is required
ChatForTouchSoft.prototype.getUserNameFromInput = function getUserNameFromInput() {
    this.config.userData.userName = this.config.appDOMVariables.userNameInput.value;
    this.config.appDOMVariables.userNameBlock.classList.toggle("invisible");
    this.setUserName();
};

ChatForTouchSoft.prototype.setUserName = function setUserName() {
    this.config.hashUserName = this.getHash(this.config.userData.userName);
    this.saveUserNameToLocalStorage();
    this.dataBaseObject.saveUserSettings(this.config.hashUserName +
        "/settings.json", JSON.stringify([
            {
                userSettings: this.config.userData
            }
        ]), 'PUT'
    );
    this.setupObject.setMessageFromUser();
};

/**
 * Sets 'onClick' button functions
 */
ChatForTouchSoft.prototype.setupOnClickFunctions = function setupOnClickFunctions() {
    this.config.appDOMVariables.mainSendButton.addEventListener(
        "click",
        this.sendMessage.bind(this, "messagesTextArea")
    );
    this.config.appDOMVariables.minimizeSendButton.addEventListener(
        "click",
        this.sendMessage.bind(this, "messagesInput")
    );
    this.config.appDOMVariables.setMinimizeStyleButton.addEventListener(
        "click",
        this.minMaxStyleToggle.bind(this)
    );
    this.config.appDOMVariables.setMaxStyleButton.addEventListener(
        "click",
        this.minMaxStyleToggle.bind(this)
    );
    this.config.appDOMVariables.userNameButton.addEventListener(
        "click",
        this.getUserNameFromInput.bind(this)
    );
};

/**
 * Adds user or bot message to messageBlock
 *
 * @param {String} inputObjName name of the message entry element item is configObj property.
 */
ChatForTouchSoft.prototype.sendMessage = function sendMessage(inputObjName) {
    var currentDate = this.getCurrentDate();
    var inputObj = this.config.appDOMVariables[inputObjName];
    var paragraph = this.createMessageParagraph(
        inputObj.value,
        false,
        this.config.userSettings.showDateTime === "true" ? currentDate : ""
    );
    this.saveHistoryOfCorrespondence(
        inputObj.value,
        currentDate,
        this.config.hashUserName,
        this.config.userData.userName
    );
    this.setParagraphToTheMessagesBlock(paragraph);
    this.getAnswer(inputObj.value);
    inputObj.value = "";
};

// STUB for bot activity
ChatForTouchSoft.prototype.getAnswer = function getAnswer(requestMessage) {
    var currentDate = this.getCurrentDate();
    var refToParentObj = this;
    var paragraph = this.createMessageParagraph(
        requestMessage.toUpperCase(),
        true,
        this.config.userSettings.showDateTime === "true" ? currentDate : ""
    );
    this.saveHistoryOfCorrespondence(
        requestMessage.toUpperCase(),
        currentDate,
        this.config.hashUserName,
        this.config.userSettings.botName
    );
    setTimeout(function addMessageToTheMessageBlock() {
        refToParentObj.setParagraphToTheMessagesBlock(paragraph);
    }, this.config.timeOfBotResponse);
};
// STUB

ChatForTouchSoft.prototype.saveHistoryOfCorrespondence = function saveHistoryOfCorrespondence(
    message,
    date,
    userName,
    sender
) {
    this.saveMessageToHistoryObject(message, date, sender);
    if (this.isHashUserName()) {
        this.dataBaseObject.saveUserMessage(userName + "/messages.json", JSON.stringify([
            {
                user: sender,
                message: message,
                date: date,
                title: "message"
            }]), 'POST');
    }
};
/**
 * Create message for chat. Add current date to message text and service text
 */
ChatForTouchSoft.prototype.createMessage = function createMessage(
    messageText,
    isBot
) {
    var result = "";
    if (!isBot) {
        result += this.config.messageFromUser.concat(messageText);
    } else {
        result += this.config.messageFromBot.concat('"', messageText, '"');
    }
    return result;
};

ChatForTouchSoft.prototype.getCurrentDate = function getCurrentDate() {
    var date = new Date();
    return date
        .getHours()
        .toString()
        .concat(":", date.getMinutes().toString());
};

// Есть ли запись в this.config.hashUserName
ChatForTouchSoft.prototype.isHashUserName = function isHashUserName() {
    return !!this.config.hashUserName;
};

/**
 *  Create DOM object with requested text
 */
ChatForTouchSoft.prototype.createMessageParagraph = function createMessageParagraph(
    messageText,
    isBot,
    messageDate
) {
    var paragraph = document.createElement("div");
    var result = this.createMessage(messageText, isBot);
    result = messageDate + result;
    paragraph.innerHTML += result;
    return paragraph;
};

ChatForTouchSoft.prototype.setParagraphToTheMessagesBlock = function setParagraphToTheMessagesBlock(
    paragraph
) {
    this.config.appDOMVariables.messagesBlock.appendChild(paragraph);
};

ChatForTouchSoft.prototype.saveMessageToHistoryObject = function saveMessageToHistoryObject(
    message,
    date,
    sender
) {
    this.config.historyMessages.push({
        message: message,
        date: date,
        sender: sender
    });
};

ChatForTouchSoft.prototype.displayHistory = function displayHistory() {
    var chatObj = this;
    this.config.historyMessages.forEach(function createElement(element) {
        var date =
            chatObj.config.userSettings.showDateTime === "true" ? element.date : "";
        var paragraph = chatObj.createMessageParagraph(
            element.message,
            !(element.sender === chatObj.config.userData.userName),
            date
        );
        chatObj.setParagraphToTheMessagesBlock(paragraph);
    });
};

// add CSS style to the page
ChatForTouchSoft.prototype.includeCSS = function includeCSS(link) {
    document.head.appendChild(link);
};

ChatForTouchSoft.prototype.createCSSLink = function createCSSLink(
    filePath,
    rel,
    type,
    id
) {
    var link = document.createElement("link");
    if (id) {
        link.setAttribute("id", id);
    }
    if (rel) {
        link.setAttribute("rel", rel);
    }
    if (type) {
        link.setAttribute("type", type);
    }
    link.setAttribute("href", filePath);
    return link;
};

// Gets chat HTML from server; invokes callback 'load' functions
ChatForTouchSoft.prototype.getHTML = function getHTML(httpPath, callbackLoad) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", callbackLoad.bind(this, xhr));
    xhr.open("GET", httpPath, true);
    xhr.send();
    return xhr.response;
};

/**
 * Includes text or other element to parentElement as innerHTML
 *
 * @param {Object} parentElement DOM element in witch it is necessary to include other text/element
 * @param {Object|String} innerHTMLtext is object/text witch to need include
 */
ChatForTouchSoft.prototype.includeHTML = function includeHTML(
    parentElement,
    innerHTMLtext
) {
    var wrapper = document.createElement("div");
    wrapper.innerHTML = innerHTMLtext;
    parentElement.appendChild(wrapper);
};

/**
 * Switches chat style and saves this state in localStorage
 * */
ChatForTouchSoft.prototype.minMaxStyleToggle = function minMaxStyleToggle() {
    this.config.appDOMVariables.mainStyleChatBlock.classList.toggle("invisible");
    this.config.appDOMVariables.minimizeStyleChatBlock.classList.toggle(
        "invisible"
    );
    this.config.userData.isMinimize = this.config.userData.isMinimize === false;
    this.dataBaseObject.saveUserSettings(this.config.hashUserName +
        "/settings.json", JSON.stringify([
            {
                userSettings: this.config.userData
            }
        ]), 'PUT'
    );
};

ChatForTouchSoft.prototype.getHash = function getHash(str) {
    var date = new Date();
    return str + date.getTime();
};

ChatForTouchSoft.prototype.getUserData = function getUserMessages() {
    var chatObj = this;
    this.dataBaseObject
        .getUserSettings(this.config.hashUserName + "/settings.json", null, "GET")
        .then(function promiseGetUserSettings (data) {
            chatObj.config.userData = data[0].userSettings;
            chatObj.setupObject.setMessageFromUser();
            chatObj.setupObject.setupChatStyle();
        })
        .then(function promiseGetUserMessage () {
            chatObj.dataBaseObject
                .getUserMessages(chatObj.config.hashUserName + "/messages.json", null, 'GET')
                .then(function getUserMessagesDataResponse (data) {
                    if (data) {
                        Object.keys(data).map(function promiseSaveUserMessage(el) {
                            chatObj.saveMessageToHistoryObject(
                                data[el][0].message,
                                data[el][0].date,
                                data[el][0].user
                            );
                            return true;
                        });
                    }
                })
                .then(chatObj.displayHistory.bind(chatObj));
        });
};

ChatForTouchSoft.prototype.saveUserNameToLocalStorage = function saveUserNameToLocalStorage() {
    localStorage.setItem(this.config.localStorageName, this.config.hashUserName);
};

ChatForTouchSoft.prototype.getUserNameFromLocalStorage = function getUserNameFromLocalStorage() {
    return localStorage.getItem(this.config.localStorageName);
};

chatForTouchSoftInstance = new ChatForTouchSoft(configObj);
setupObject = new SetupObject(configObj);

QUnit.module("should test functions of ChatForTouchSoft class");
QUnit.test("should create a valid css link element", function test(assert) {
    var testLink = chatForTouchSoftInstance.createCSSLink(
        "https://rawgit.com/UnacceptableCondition/Homework_1/master/css/chat.css",
        "stylesheet",
        "text/css",
        "touch-soft-chat-css"
    );
    var openTag = "<".concat(testLink.tagName);
    Object.keys(testLink.attributes).map(function createLink(objectKey) {
        var attrib = testLink.attributes[objectKey];
        openTag += " ".concat(attrib.name, "=", attrib.value);
        return true;
    });
    openTag += ">";
    assert.equal(
        openTag,
        "<LINK id=touch-soft-chat-css rel=stylesheet type=text/css href=https://rawgit.com/UnacceptableCondition/Homework_1/master/css/chat.css>",
        "CSS link is valid"
    );
});
QUnit.test("includeCSS should add css link to document DOM", function test(
    assert
) {
    var linkInTheDOM;
    var testLink = chatForTouchSoftInstance.createCSSLink(
        "https://rawgit.com/UnacceptableCondition/Homework_1/master/css/chat.css",
        "stylesheet",
        "text/css",
        "touch-soft-chat-css"
    );
    chatForTouchSoftInstance.includeCSS(testLink);
    linkInTheDOM = document.getElementById("touch-soft-chat-css");
    assert.ok(linkInTheDOM, "CSS link was added to document");
});
QUnit.test("includeHTML should insert test HTML to document", function test(
    assert
) {
    var testHtmlDiv = "<div id='test-html-touchsoft'>testText</div>";
    var findedEl;
    chatForTouchSoftInstance.includeHTML(document.body, testHtmlDiv);
    findedEl = document.getElementById("test-html-touchsoft");
    assert.ok(findedEl, "test HTML insert to document");
    assert.equal(findedEl.innerHTML, "testText", "test HTML inner text is valid");
    findedEl.remove();
});
QUnit.module("should test functions of SetupObject class");
QUnit.test(
    "parseSrcForParameters should return object with param",
    function test(assert) {
        var testSrc = "testetste?name='Ivan'&name2=Anastasia";
        var userConfigObject = setupObject.parseSrcForParameters(testSrc);

        assert.equal(userConfigObject.name, "Ivan", "name param is valid");
        assert.equal(userConfigObject.name2, "Anastasia", "name2 param is valid");
    }
);
QUnit.test(
    "setMessageFromUser should set config.messageFromUser",
    function test(assert) {
        setupObject.config.userData.userName = "TestIvan";
        setupObject.setMessageFromUser();
        assert.equal(
            setupObject.config.messageFromUser,
            " TestIvan : ",
            "config.messageFromUser is valid"
        );
        setupObject.config.userData.userName = null;
        setupObject.setMessageFromUser();
        assert.equal(
            setupObject.config.messageFromUser,
            " Вы : ",
            "config.messageFromUser default is valid"
        );
    }
);
QUnit.test("setMessageFromBot should set config.messageFromBot", function test(
    assert
) {
    setupObject.config.userSettings = [];
    setupObject.config.userSettings.botName = "TestIvan";
    setupObject.setMessageFromBot();
    assert.equal(
        setupObject.config.messageFromBot,
        " TestIvan: Ответ на ",
        "config.messageFromUser is valid"
    );
    setupObject.config.userSettings.botName = null;
    setupObject.setMessageFromBot();
    assert.equal(
        setupObject.config.messageFromBot,
        " Bot: Ответ на ",
        "config.messageFromUser default is valid"
    );
});
testHtml =
    '<div class="root_chat_for_touchsoft invisible">\n' +
    '    <div class="root_chat_for_touchsoft_input-name-block invisible">\n' +
    "        <div>Введите ваше имя: </div>\n" +
    '        <input type="text" class="root_chat_for_touchsoft_input-name">\n' +
    '        <button class="root_chat_for_touchsoft_input-name-button">Ок</button>\n' +
    "    </div>\n" +
    '    <div class="root_chat_for_touchsoft-title">\n' +
    "\n" +
    "    </div>\n" +
    '    <div class="root_chat_for_touchsoft__top">\n' +
    '        <div class="root_chat_for_touchsoft__top_messages">\n' +
    "\n" +
    "        </div>\n" +
    '        <div class="root_chat_for_touchsoft__top_minimize-button">\n' +
    "            <span>-</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    '    <div class="root_chat_for_touchsoft__bottom">\n' +
    '        <div class="root_chat_for_touchsoft__bottom_user-message">\n' +
    '            <textarea name="messageArea" class="root_chat_for_touchsoft__textarea" cols="30" rows="10"></textarea>\n' +
    "        </div>\n" +
    '        <div class="root_chat_for_touchsoft__bottom_send-button">\n' +
    "            <span>Send</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    '<div class="root_chat_for_touchsoft_minimize-style invisible">\n' +
    '    <div class="root_chat_for_touchsoft_minimize-style__message">\n' +
    '        <input type="text" class="root_chat_for_touchsoft_minimize-style__message-input">\n' +
    "    </div>\n" +
    '    <div class="root_chat_for_touchsoft_minimize-style__send-button">\n' +
    "        <span>send</span>\n" +
    "    </div>\n" +
    '    <div class="root_chat_for_touchsoft_minimize-style__max-button">\n' +
    "        <span>{}</span>\n" +
    "    </div>\n" +
    "</div>";
chatForTouchSoftInstance.includeHTML(document.body, testHtml);
setupObject.setupDOMVariables(chatForTouchSoftInstance.config.appDOMVariables);
QUnit.test(
    "setupDOMVariables should find chat DOM elements to get access",
    function test(assert) {
        assert.ok(
            chatForTouchSoftInstance.config.appDOMVariables.messagesBlock.classList.contains(
                "root_chat_for_touchsoft__top_messages"
            ),
            "this test is fine"
        );
        assert.ok(
            chatForTouchSoftInstance.config.appDOMVariables.minimizeStyleChatBlock.classList.contains(
                "root_chat_for_touchsoft_minimize-style"
            ),
            "this test is fine"
        );
        assert.ok(
            chatForTouchSoftInstance.config.appDOMVariables.mainStyleChatBlock.classList.contains(
                "root_chat_for_touchsoft"
            ),
            "this test is fine"
        );
        assert.ok(
            chatForTouchSoftInstance.config.appDOMVariables.messagesTextArea.classList.contains(
                "root_chat_for_touchsoft__textarea"
            ),
            "this test is fine"
        );
        assert.ok(
            chatForTouchSoftInstance.config.appDOMVariables.messagesInput.classList.contains(
                "root_chat_for_touchsoft_minimize-style__message-input"
            ),
            "this test is fine"
        );
        assert.ok(
            chatForTouchSoftInstance.config.appDOMVariables.mainSendButton.classList.contains(
                "root_chat_for_touchsoft__bottom_send-button"
            ),
            "this test is fine"
        );
        assert.ok(
            chatForTouchSoftInstance.config.appDOMVariables.minimizeSendButton.classList.contains(
                "root_chat_for_touchsoft_minimize-style__send-button"
            ),
            "this test is fine"
        );
        assert.ok(
            chatForTouchSoftInstance.config.appDOMVariables.setMinimizeStyleButton.classList.contains(
                "root_chat_for_touchsoft__top_minimize-button"
            ),
            "this test is fine"
        );
        assert.ok(
            chatForTouchSoftInstance.config.appDOMVariables.setMaxStyleButton.classList.contains(
                "root_chat_for_touchsoft_minimize-style__max-button"
            ),
            "this test is fine"
        );
    }
);
QUnit.test(
    "setPositionOfMainBlock should set mainStyleChatBlock class right or left position",
    function test(assert) {
        setupObject.config.userSettings = [];
        setupObject.config.userSettings.position = "right";
        setupObject.setPositionOfMainBlock();
        assert.ok(
            setupObject.config.appDOMVariables.mainStyleChatBlock.classList.contains(
                "root_chat_for_touchsoft_right-position"
            ),
            "right position true"
        );
        setupObject.config.userSettings.position = "left";
        setupObject.setPositionOfMainBlock();
        assert.ok(
            setupObject.config.appDOMVariables.mainStyleChatBlock.classList.contains(
                "root_chat_for_touchsoft_left-position"
            ),
            "left position true"
        );
    }
);
QUnit.test(
    "setupChatStyle should delete invisible class from mainStyleChatBlock",
    function test(assert) {
        setupObject.setupChatStyle();
        assert.notOk(
            setupObject.config.appDOMVariables.mainStyleChatBlock.classList.contains(
                "invisible"
            ),
            "invisible left"
        );
    }
);
QUnit.test("setTitle should set title", function test(assert) {
    setupObject.config.userSettings = [];
    setupObject.config.userSettings.title = "TestChatTitle";
    setupObject.setTitle();
    assert.equal(
        setupObject.config.appDOMVariables.titleBlock.innerHTML,
        "TestChatTitle",
        "title is valid"
    );
    setupObject.config.userSettings.title = null;
    setupObject.setTitle();
    assert.equal(
        setupObject.config.appDOMVariables.titleBlock.innerHTML,
        "TouchSoft Chat",
        "title is valid"
    );
});
QUnit.test(
    "allowMinimize should add invisible class to setMinimizeStyleButton",
    function test(assert) {
        setupObject.config.userSettings = [];
        setupObject.config.userSettings.allowMinimize = "false";
        setupObject.allowMinimize();
        assert.ok(
            setupObject.config.appDOMVariables.setMinimizeStyleButton.classList.contains(
                "invisible"
            ),
            "invisible added"
        );
    }
);
QUnit.test(
    "setMainCssClass should add css class to chat parent div",
    function test(assert) {
        setupObject.config.userSettings = [];
        setupObject.config.userSettings.cssClass = "TestClass";
        setupObject.setMainCssClass();
        assert.ok(
            setupObject.config.appDOMVariables.mainStyleChatBlock.parentNode.classList.contains(
                "TestClass"
            ),
            "TestClass added"
        );
        setupObject.config.userSettings.cssClass = null;
        setupObject.setMainCssClass();
        assert.ok(
            setupObject.config.appDOMVariables.mainStyleChatBlock.parentNode.classList.contains(
                "touchsoft-chat_main-block"
            ),
            "default class added"
        );
    }
);
QUnit.test(
    "userNameIsRequire should add delete invisible calss from userNameBlock ",
    function test(assert) {
        setupObject.config.userSettings = [];
        setupObject.config.userSettings.requireName = "true";
        setupObject.userNameIsRequire();
        assert.notOk(
            setupObject.config.appDOMVariables.userNameBlock.classList.contains(
                "invisible"
            ),
            "invisible deleted"
        );
    }
);
dataBaseObject = new DataBaseObject("fetch", configObj.defaultDbURL, configObj);
dataBaseObject.setup();
QUnit.module("should test functions of DataBaseObject class");
QUnit.test("requestFetch should request data and get them", function test(
    assert
) {
    var done = assert.async();
    var testPromise;
    var data;
    dataBaseObject.requestFetch(
        "TestName/settings.json",
        JSON.stringify([
            {
                userSettings: "TestSettings"
            }
        ]),
        "PUT"
    );
    setTimeout(function testTimeoutFirst () {
        setTimeout(function testTimeoutSecond () {
            testPromise = dataBaseObject.requestFetch(
                "TestName/settings.json",
                null,
                "GET"
            );
            testPromise.then(function getDataFetch (promiseData) {
                data = promiseData;
            });
            setTimeout(function testTimeoutThird () {
                assert.equal(data[0].userSettings, "TestSettings", " true");
                done();
            }, 1000);
        }, 1000);
    }, 1000);
});
QUnit.test("requestXMR should request data and get them", function test(
    assert
) {
    var done = assert.async();
    var testPromise;
    var data;
    dataBaseObject.requestXMR(
        "TestName/settings.json",
        JSON.stringify([
            {
                userSettings: "TestSettings"
            }
        ]),
        "PUT"
    );
    setTimeout(function testTimeoutFirst () {
        setTimeout(function testTimeoutSecond () {
            testPromise = dataBaseObject.requestXMR(
                "TestName/settings.json",
                null,
                "GET"
            );
            testPromise.then(function getDataXMR (promiseData) {
                data = promiseData;
            });
            setTimeout(function testTimeoutThird () {
                assert.equal(data[0].userSettings, "TestSettings", " true");
                done();
            }, 1000);
        }, 1000);
    }, 1000);
});
QUnit.test(
    "saveUserNameToLocalStorage should add name to localStorage",
    function test(assert) {
        chatForTouchSoftInstance.config.hashUserName = "testName";
        chatForTouchSoftInstance.saveUserNameToLocalStorage();
        assert.equal(
            localStorage.getItem(chatForTouchSoftInstance.config.localStorageName),
            "testName",
            "testName saved"
        );
    }
);
QUnit.test(
    "saveUserNameToLocalStorage should get name from localStorage",
    function test(assert) {
        chatForTouchSoftInstance.config.hashUserName = "testName";
        chatForTouchSoftInstance.saveUserNameToLocalStorage();
        chatForTouchSoftInstance.getUserNameFromLocalStorage();
        assert.equal(
            chatForTouchSoftInstance.config.hashUserName,
            "testName",
            "testName saved"
        );
    }
);
QUnit.module("test DOM from result page");
QUnit.test("should find link with chat css", function test(assert) {
    var link = document.getElementById("touch-soft-chat-css");
    assert.equal(
        link.getAttribute("id"),
        "touch-soft-chat-css",
        "link's id is true"
    );
    assert.equal(link.getAttribute("rel"), "stylesheet", "link's rel is true");
    assert.equal(link.getAttribute("type"), "text/css", "link's type is true");
    assert.equal(
        link.getAttribute("href"),
        "https://rawgit.com/UnacceptableCondition/Homework_1/master/css/chat.css",
        "link's href is true"
    );
});
QUnit.test("should find minimize-style div and compare his DOM", function test(
    assert
) {
    var minDiv = document.getElementsByClassName(
        "root_chat_for_touchsoft_minimize-style"
    )[0];
    assert.ok(
        minDiv.firstElementChild.classList.contains(
            "root_chat_for_touchsoft_minimize-style__message"
        ),
        "first child ok"
    );
    assert.ok(
        minDiv.firstElementChild.firstElementChild.classList.contains(
            "root_chat_for_touchsoft_minimize-style__message-input"
        ),
        "input is ok"
    );
    assert.ok(
        minDiv.lastElementChild.classList.contains(
            "root_chat_for_touchsoft_minimize-style__max-button"
        ),
        "last child ok"
    );
    assert.ok(
        minDiv.lastElementChild.previousElementSibling.classList.contains(
            "root_chat_for_touchsoft_minimize-style__send-button"
        ),
        "midle child is ok"
    );
});
QUnit.test("should find main-style div and compare his DOM", function test(
    assert
) {
    var mainDiv = document.getElementsByClassName("root_chat_for_touchsoft")[0];
    assert.ok(
        mainDiv.firstElementChild.classList.contains(
            "root_chat_for_touchsoft_input-name-block"
        ),
        "first child ok"
    );
    assert.ok(
        mainDiv.firstElementChild.lastElementChild.classList.contains(
            "root_chat_for_touchsoft_input-name-button"
        ),
        "first child, second level DOM, first element ok"
    );
    assert.ok(
        mainDiv.lastElementChild.classList.contains(
            "root_chat_for_touchsoft__bottom"
        ),
        "last child ok"
    );
    assert.ok(
        mainDiv.lastElementChild.firstElementChild.classList.contains(
            "root_chat_for_touchsoft__bottom_user-message"
        ),
        "last child, second level DOM, first element ok"
    );
    assert.ok(
        mainDiv.lastElementChild.lastElementChild.classList.contains(
            "root_chat_for_touchsoft__bottom_send-button"
        ),
        "last child, second level DOM, second element ok"
    );
    assert.ok(
        mainDiv.lastElementChild.firstElementChild.firstElementChild.classList.contains(
            "root_chat_for_touchsoft__textarea"
        ),
        "textArea is ok"
    );
});
