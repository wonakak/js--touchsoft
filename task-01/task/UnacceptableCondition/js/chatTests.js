/* global document */
/* global localStorage */
/* global XMLHttpRequest */
/* global QUnit */
var configObj = {
	messageFromBot: " Bot: Ответ на ",
	messageFromUser: " Вы : ",
	timeOfBotResponse: 10000,
	localStorageName: "historyMessages",
	pathToHtmlFile: "https://rawgit.com/UnacceptableCondition/Homework_1/master/html/chat.html",
	pathToCssFile: "https://rawgit.com/UnacceptableCondition/Homework_1/master/css/chat.css",
	isMinimize: false,
	appDOMVariables: {
		messagesBlock: {className: "root_chat_for_touchsoft__top_messages"},
		minimizeStyleChatBlock: {
			className: "root_chat_for_touchsoft_minimize-style"
		},
		mainStyleChatBlock: {className: "root_chat_for_touchsoft"},
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
		messagesTextArea: {className: "root_chat_for_touchsoft__textarea"},
		messagesInput: {
			className: "root_chat_for_touchsoft_minimize-style__message-input"
		}
	},

	historyMessages: []
};

var chatForTouchSoftInstance;

function ChatForTouchSoft(configObject) {
	this.config = configObject;
}

/**
 * Gets access to chat DOM elements and writes them in appDOMVariables
 * object instead object which it contains
 *
 * @param {Array|Object} appDOMVariables array of classes DOM elements to which you wants to access
 * array element is object with string property "className"
 */
ChatForTouchSoft.prototype.setupDOMVariables = function setupDOMVariables (appDOMVariables) {
	var newAppDOMVariables = {};
	Object.keys(appDOMVariables).map(function setElementsAccess (objectKey) {
		newAppDOMVariables[objectKey] = document.getElementsByClassName(
			appDOMVariables[objectKey].className
		)[0];
		return null;
	});
	chatForTouchSoftInstance.config.appDOMVariables = newAppDOMVariables;
};

/**
 * Init shat style on the first load or reload page
 */
ChatForTouchSoft.prototype.setupChatStyle = function setupChatStyle () {
	this.config.isMinimize = localStorage.getItem("isMinimize") || "false";
	if (this.config.isMinimize === "false") {
		this.config.appDOMVariables.mainStyleChatBlock.classList.toggle("visible");
		this.config.appDOMVariables.minimizeStyleChatBlock.classList.toggle(
			"visible"
		);
	}
};

/**
 * Sets 'onClick' button functions
 */
ChatForTouchSoft.prototype.setupOnClickFunctions = function setupOnClickFunctions () {
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
};

/**
 * Adds user or bot message to messageBlock
 *
 * @param {String} inputObjName name of the message entry element item is configObj property.
 */
ChatForTouchSoft.prototype.sendMessage = function sendMessage (inputObjName) {
	var inputObj = this.config.appDOMVariables[inputObjName];
	var paragraph = this.createMessageParagraph(
		inputObj.value,
		false,
		false,
		this.config
	);
	this.saveHistoryOfCorrespondence(paragraph.innerHTML, this.config.localStorageName);
	this.setParagraphToTheMessagesBlock(paragraph);
	this.getAnswer(inputObj.value);
	inputObj.value = "";
};

// STUB for bot activity
ChatForTouchSoft.prototype.getAnswer = function getAnswer (requestMessage) {
	var refToParentObj = this;
	var paragraph = this.createMessageParagraph(
		requestMessage.toUpperCase(),
		false,
		true,
		this.config
	);
	this.saveHistoryOfCorrespondence(paragraph.innerHTML, this.config.localStorageName);
	setTimeout(function addMessageToTheMessageBlock () {
		refToParentObj.setParagraphToTheMessagesBlock(paragraph);
	}, this.config.timeOfBotResponse);
};
// STUB

ChatForTouchSoft.prototype.saveHistoryOfCorrespondence = function saveHistoryOfCorrespondence (message, localStorageName) {
	this.saveMessageToHistoryObject(message);
	this.saveHistoryObject(localStorageName);
};
/**
 * Create message for chat. Add current date to message text and service text
 */
ChatForTouchSoft.prototype.createMessage = function createMessage (messageText, isBot) {
	var date = new Date();
	var result = date.getHours().toString().concat(":", date.getMinutes().toString());
	if (!isBot) {
		result += this.config.messageFromUser.concat(messageText);
	} else {
		result += this.config.messageFromBot.concat( "\"" , messageText , "\"");
	}
	return result;
};

/**
 *  Create DOM object with requested text
 */
ChatForTouchSoft.prototype.createMessageParagraph = function createMessageParagraph (messageText, isHistory, isBot) {
	var paragraph = document.createElement("div");
	var result;
	if (!isHistory) {
		result = this.createMessage(messageText, isBot);
	} else {
		result = messageText;
	}
	paragraph.innerHTML += result;
	return paragraph;
};


ChatForTouchSoft.prototype.setParagraphToTheMessagesBlock = function setParagraphToTheMessagesBlock (paragraph) {
	this.config.appDOMVariables.messagesBlock.appendChild(paragraph);
};

// Gets history of correspondence
ChatForTouchSoft.prototype.getHistoryCorrespondence = function getHistoryCorrespondence (keyForLocalStorage) {
	return JSON.parse(localStorage.getItem(keyForLocalStorage)) || [];
};

// Save message to localStorage and push it to historyMessageObject
ChatForTouchSoft.prototype.saveHistoryObject = function saveHistoryObject (keyForLocalStorage) {
	JSON.stringify(this.config.historyMessages);
	localStorage.setItem(
		keyForLocalStorage,
		JSON.stringify(this.config.historyMessages)
	);
};

ChatForTouchSoft.prototype.saveMessageToHistoryObject = function saveMessageToHistoryObject (message) {
	this.config.historyMessages.push(message);
};

ChatForTouchSoft.prototype.displayHistory = function displayHistory () {
	var refToParentObj = this;
	this.config.historyMessages.forEach(function createElement (element) {
		var paragraph = refToParentObj.createMessageParagraph(
			element,
			true,
			false,
			refToParentObj.config
		);
		refToParentObj.setParagraphToTheMessagesBlock(paragraph);
	});
};

// add CSS style to the page
ChatForTouchSoft.prototype.includeCSS = function includeCSS (link) {
	document.head.appendChild(link);
};

ChatForTouchSoft.prototype.createCSSLink = function createCSSLink (filePath, rel, type, id) {
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

// Invokes all setup functions, gets history of messages and display it
ChatForTouchSoft.prototype.setupAppConfiguration = function setupAppConfiguration () {
	this.setupDOMVariables(this.config.appDOMVariables);
	this.setupChatStyle();
	this.setupOnClickFunctions();
	this.config.historyMessages = this.getHistoryCorrespondence(
		this.config.localStorageName
	);
	this.displayHistory();
};

// Gets chat HTML from server; invokes callback 'load' functions
ChatForTouchSoft.prototype.getHTML = function getHTML (httpPath, callbackLoad) {
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
ChatForTouchSoft.prototype.includeHTML = function includeHTML (parentElement, innerHTMLtext) {
	var wrapper = document.createElement("div");
	wrapper.innerHTML = innerHTMLtext;
	parentElement.appendChild(wrapper);
};

// Enter point
ChatForTouchSoft.prototype.startApp = function startApp () {
	var cssLink = this.createCSSLink(
		this.config.pathToCssFile,
		"stylesheet",
		"text/css",
		"touch-soft-chat-css"
	);
	var callbackLoad = function callbackLoad (requestObj) {
		this.includeHTML(document.body, requestObj.response);
		this.setupAppConfiguration();
	};
	this.getHTML(this.config.pathToHtmlFile, callbackLoad);
	this.includeCSS(cssLink);
};

/**
 * Switches chat style and saves this state in localStorage
 * */
ChatForTouchSoft.prototype.minMaxStyleToggle = function minMaxStyleToggle () {
	this.config.appDOMVariables.mainStyleChatBlock.classList.toggle("visible");
	this.config.appDOMVariables.minimizeStyleChatBlock.classList.toggle(
		"visible"
	);
	this.config.isMinimize = this.config.isMinimize === "false"
		? "true"
		: "false";
	localStorage.setItem("isMinimize", this.config.isMinimize);
};

chatForTouchSoftInstance = new ChatForTouchSoft(configObj);

QUnit.module("should test functions of ChatForTouchSoft class");
QUnit.test("should create a valid css link element", function test (assert) {
    var testLink = chatForTouchSoftInstance.createCSSLink(
        "https://rawgit.com/UnacceptableCondition/Homework_1/master/css/chat.css",
        "stylesheet",
        "text/css",
        "touch-soft-chat-css"
    );
    var openTag = "<".concat(testLink.tagName);
    Object.keys(testLink.attributes).map(function createLink (objectKey) {
        var attrib = testLink.attributes[objectKey];
        openTag += " ".concat(attrib.name , "=" , attrib.value);
        return true;
    });
    openTag += ">";
    assert.equal(
        openTag,
        "<LINK id=touch-soft-chat-css rel=stylesheet type=text/css href=https://rawgit.com/UnacceptableCondition/Homework_1/master/css/chat.css>",
        "CSS link is valid"
    );
});
QUnit.test("includeCSS should add css link to document DOM", function test (assert) {
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
QUnit.test("includeHTML should insert test HTML to document", function test (assert) {
    var testHtml = "<div id='test-html-touchsoft'>testText</div>";
	var findedEl;
    chatForTouchSoftInstance.includeHTML(document.body, testHtml);
	findedEl = document.getElementById("test-html-touchsoft");
    assert.ok(findedEl, "test HTML insert to document");
    assert.equal(findedEl.innerHTML, "testText", "test HTML inner text is valid");
    findedEl.remove();
});
QUnit.test(
    "setupDOMVariables should find chat DOM elements to get access",
    function test (assert) {
        var testHtml =
            '<div class="root_chat_for_touchsoft visible">\n' +
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
            '<div class="root_chat_for_touchsoft_minimize-style">\n' +
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
        chatForTouchSoftInstance.setupDOMVariables(
            chatForTouchSoftInstance.config.appDOMVariables
        );
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
QUnit.test("setupChatStyle should set isMinimize state", function test(assert) {
    chatForTouchSoftInstance.setupChatStyle();
    chatForTouchSoftInstance.setupOnClickFunctions();
    assert.ok(chatForTouchSoftInstance.config.isMinimize, "set isMinimize state");
});
QUnit.test(
    "saveMessageToHistoryObject should add message to history object",
    function test (assert) {
        chatForTouchSoftInstance.saveMessageToHistoryObject("TEST_MESSAGE_1");
        assert.ok(
            chatForTouchSoftInstance.config.historyMessages.indexOf(
                "TEST_MESSAGE_1"
            ) !== -1,
            "test message add to history"
        );
    }
);
QUnit.test(
    "saveHistoryObject should add historyObject to localStorage",
    function test (assert) {
        chatForTouchSoftInstance.saveHistoryObject("TEST_STORAGE");
        assert.ok(
            localStorage.getItem("TEST_STORAGE"),
            "save test message to storage"
        );
    }
);
QUnit.test(
    "getHistoryCorrespondence should get message object from  localstorage",
    function test (assert) {
        chatForTouchSoftInstance.saveMessageToHistoryObject("TEST_MESSAGE_2");
        chatForTouchSoftInstance.saveHistoryObject(
            chatForTouchSoftInstance.config.localStorageName
        );
        chatForTouchSoftInstance.config.historyMessages = chatForTouchSoftInstance.getHistoryCorrespondence(
            chatForTouchSoftInstance.config.localStorageName
        );
        chatForTouchSoftInstance.displayHistory();
        assert.ok(
            chatForTouchSoftInstance.config.historyMessages.indexOf(
                "TEST_MESSAGE_2"
            ) !== -1,
            "test message add to history"
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
QUnit.test("should find main-style div and compare his DOM", function test (assert) {
    var mainDiv = document.getElementsByClassName("root_chat_for_touchsoft")[0];
    assert.ok(
        mainDiv.firstElementChild.classList.contains(
            "root_chat_for_touchsoft__top"
        ),
        "first child ok"
    );
    assert.ok(
        mainDiv.firstElementChild.firstElementChild.classList.contains(
            "root_chat_for_touchsoft__top_messages"
        ),
        "first child, second level DOM, first element ok"
    );
    assert.ok(
        mainDiv.firstElementChild.lastElementChild.classList.contains(
            "root_chat_for_touchsoft__top_minimize-button"
        ),
        "first child, second level DOM, last element ok"
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