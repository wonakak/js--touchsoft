var USER_ID = "chat-user-id";
var COLLAPSED = "chat-collapsed";
var EXPANDED = "chat-expanded";
var CHAT_ITEM = "chat";
var MESSAGES_LIST = "chat-messages";
var INPUT_BOX = "chat-input-box";
var INPUT_TEXT = "chat-input-txt";
var CHAT_MESSAGE_BUTTON_ID = "chat-message-button";
var TOGGLE_BUTTON = "chat-toggle-button";
var EXPAND_MARK = "[ ]";
var COLLAPSE_MARK = "-";
var months = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря"
];
var REPLY_TIMEOUT = 15000;
var PATH_TO_STYLESHEET =
  "https://rawgit.com/Besomhead/js--touchsoft/besomhead-task-02/task-02/Besomhead/src/chat/chat_styles.css";
var REQUEST_FETCH = "fetch";
var REQUEST_XHR = "xhr";
var DEFAULT_USER_NAME = "Вы";
var HTTP_GET = "GET";
var HTTP_POST = "POST";
var HTTP_PUT = "PUT";
var USER_NAME_FIELD = "userName";
var CHAT_STATE_FIELD = "chatState";
var MESSAGES_FIELD = "messages";
var USER_NAME_PROMPT_ID = "chat-username-prompt-container";
var PROMPT_INPUT_ID = "chat-username-prompt-input";
var PROMPT_CONFIRM_BUTTON_ID = "chat-username-prompt-button";
var REQUEST_TIMEOUT = 1000;
var config = {
  chatTitle: "Чат",
  chatState: "",
  userName: "",
  botName: "Бот",
  chatURL: "https://besomhead-chat.firebaseio.com/",
  cssClass: "chat-container",
  position: "right",
  allowMinimize: "true",
  allowDrag: "false",
  requireName: "false",
  showDateTime: "true",
  requests: "fetch",
  messagesLength: "0"
};

function getCurrentTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();

  return (hours < 10 ? "0" : "")
    .concat(hours.toString())
    .concat(":")
    .concat(minutes < 10 ? "0" : "")
    .concat(minutes.toString());
}

function Message(date, sender, body) {
  this.day = date.getDate();
  this.month = date.getMonth();
  this.time = getCurrentTime(date);
  this.sender = sender;
  this.body = body;
}

function UnexpectedValueException(key, value) {
  this.value = value;
  this.key = key;
  this.message = "Unexpected key/value pair";
}

function getDBPath(extraPath) {
  return (
    config.chatURL + localStorage.getItem(USER_ID) + "/" + extraPath + ".json"
  );
}

function getRequestConfigObj(requestMethod, data) {
  var configObj = {
    method: requestMethod,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };

  if (requestMethod !== HTTP_GET) {
    configObj.body = JSON.stringify(data);
  }

  return configObj;
}

function sendRequestToStorageByFetch(extraPath, requestMethod, data) {
  return fetch(getDBPath(extraPath), getRequestConfigObj(requestMethod, data))
    .then(function getResponse(response) {
      return response.json();
    })
    .then(function getResponseData(responseData) {
      return responseData;
    });
}

function sendRequestToStorageByXHR(extraPath, method, data) {
  return new Promise(function sendXHRRequest(resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.open(method, getDBPath(extraPath), true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", function onLoad() {
      resolve(JSON.parse(xhr.response));
    });
    xhr.addEventListener("error", function onError() {
      reject(xhr.statusText);
    });
    xhr.send(JSON.stringify(data));
  });
}

function sendRequestToStorage(extraPath, method, data) {
  var response;

  if (config.requests === REQUEST_FETCH) {
    response = sendRequestToStorageByFetch(extraPath, method, data);
  } else if (config.requests === REQUEST_XHR) {
    response = sendRequestToStorageByXHR(extraPath, method, data);
  }

  return response;
}

function saveChatStateToStorage(state) {
  config.chatState = state;
  sendRequestToStorage(CHAT_STATE_FIELD, HTTP_PUT, state);
}

function collapseChat() {
  document.getElementById(CHAT_ITEM).classList.remove(EXPANDED);
  document.getElementById(CHAT_ITEM).classList.add(COLLAPSED);
  document.getElementById(TOGGLE_BUTTON).innerHTML = EXPAND_MARK;
  document
    .getElementById(CHAT_ITEM)
    .removeChild(document.getElementById(MESSAGES_LIST));
  document
    .getElementById(CHAT_ITEM)
    .removeChild(document.getElementById(INPUT_BOX));
  saveChatStateToStorage(COLLAPSED);
}

function appendMessagePart(container, innerHTML) {
  var el = document.createElement("div");

  el.innerHTML = innerHTML;
  container.appendChild(el);
}

function appendDateLegend(container, message) {
  var dayOfMonth = document.createElement("legend");

  dayOfMonth.innerHTML = message.day
    .toString()
    .concat(" ")
    .concat(months[+message.month]);
  dayOfMonth.className = "chat-day-of-month";
  container.appendChild(dayOfMonth);
}

function appendSingleMessage(container, message) {
  var containerId;
  var messagesContainer;

  containerId = CHAT_ITEM.concat("-")
    .concat(message.day)
    .concat("-")
    .concat(message.month);
  if (document.getElementById(containerId) === null) {
    messagesContainer = document.createElement("div");
    messagesContainer.id = containerId;
    messagesContainer.className = "chat-messages-container";
    if (config.showDateTime === "true") {
      messagesContainer.classList.add("chat-messages-container-with-time");
      appendDateLegend(container, message);
    } else if (config.showDateTime === "false") {
      messagesContainer.classList.add("chat-messages-container-no-time");
    }
    container.appendChild(messagesContainer);
  }
  messagesContainer = document.getElementById(containerId);
  if (config.showDateTime === "true") {
    appendMessagePart(messagesContainer, message.time);
  }
  appendMessagePart(messagesContainer, message.sender);
  appendMessagePart(messagesContainer, message.body);
}

function appendMessages(container) {
  sendRequestToStorage(MESSAGES_FIELD, HTTP_GET, "").then(
    function showMessagesInChat(data) {
      var keyIndex;
      var messagesKeys;
      if (!data) {
        return;
      }
      messagesKeys = Object.keys(data);
      config.messagesLength = messagesKeys.length;
      for (keyIndex = 0; keyIndex < messagesKeys.length; keyIndex += 1) {
        appendSingleMessage(container, data[messagesKeys[keyIndex]]);
      }
    }
  );
}

function appendMessagesList() {
  var messagesListContainer = document.createElement("div");

  messagesListContainer.id = MESSAGES_LIST;
  messagesListContainer.className = "chat-messages-external";
  document.getElementById(CHAT_ITEM).appendChild(messagesListContainer);
  appendMessages(messagesListContainer);
}

function updateMessagesList() {
  sendRequestToStorage(MESSAGES_FIELD, HTTP_GET, "").then(
    function onMessagesReceived(data) {
      var messagesKeys = Object.keys(data);
      var keyIndex;

      if (!data) {
        return;
      }
      if (config.messagesLength >= messagesKeys.length) {
        return;
      }
      for (
        keyIndex = config.messagesLength + 1;
        keyIndex < messagesKeys.length;
        keyIndex += 1
      ) {
        appendSingleMessage(
          document.getElementById(MESSAGES_LIST),
          data[messagesKeys[keyIndex]]
        );
      }
      config.messagesLength = messagesKeys.length;
    }
  );
}

function saveMessage(message) {
  sendRequestToStorage(MESSAGES_FIELD, HTTP_POST, message);
}

function sendReply(message) {
  var reply = new Message(
    new Date(),
    config.botName.concat(":"),
    "Ответ на ".concat(JSON.stringify(message).toUpperCase())
  );
  saveMessage(reply);
}

function sendMessage() {
  var inputTextArea = document.getElementById(INPUT_TEXT);
  var message;

  if (inputTextArea.value !== "") {
    message = new Message(
      new Date(),
      config.userName.concat(":"),
      inputTextArea.value
    );
    inputTextArea.value = "";
    appendSingleMessage(document.getElementById(MESSAGES_LIST), message);
    saveMessage(message);
    setTimeout(sendReply, REPLY_TIMEOUT, message.body);
    setInterval(updateMessagesList, REPLY_TIMEOUT);
  }
}

function appendInputBox() {
  var inputMessageContainer = document.createElement("div");
  var inputTextArea = document.createElement("textarea");
  var messageButton = document.createElement("button");

  inputMessageContainer.id = INPUT_BOX;
  inputMessageContainer.className = "chat-input-container";
  inputTextArea.id = INPUT_TEXT;
  inputTextArea.className = "chat-input-textarea";
  inputMessageContainer.appendChild(inputTextArea);
  messageButton.id = CHAT_MESSAGE_BUTTON_ID;
  messageButton.className = "chat-message-button";
  messageButton.innerHTML = "Отправить";
  messageButton.addEventListener("click", sendMessage);
  inputMessageContainer.appendChild(messageButton);
  document.getElementById(CHAT_ITEM).appendChild(inputMessageContainer);
}

function getPositionClass() {
  var positionClass;

  if (config.position === "left") {
    positionClass = "chat-container-left";
  } else if (config.position === "right") {
    positionClass = "chat-container-right";
  }

  return positionClass;
}

function createUserNamePromptMarkup() {
  var promptContainer = document.createElement("div");
  var promptLabel = document.createElement("label");
  var promptInput = document.createElement("input");
  var promptConfirmButton = document.createElement("button");

  promptContainer.id = USER_NAME_PROMPT_ID;
  promptContainer.classList.add("chat-prompt-container", getPositionClass());
  promptInput.id = PROMPT_INPUT_ID;
  promptInput.className = "chat-prompt-input";
  promptLabel.for = promptInput.id;
  promptLabel.innerHTML = "Пожалуйста, представьтесь:";
  promptConfirmButton.id = PROMPT_CONFIRM_BUTTON_ID;
  promptConfirmButton.className = "chat-prompt-button";
  promptConfirmButton.innerHTML = "Сохранить";
  promptContainer.appendChild(promptLabel);
  promptContainer.appendChild(promptInput);
  promptContainer.appendChild(promptConfirmButton);
  document.getElementById(CHAT_ITEM).appendChild(promptContainer);
}

function setOtherComponentsAvailability(isAvailable) {
  document.getElementById(INPUT_TEXT).disabled = !isAvailable;
  document.getElementById(CHAT_MESSAGE_BUTTON_ID).disabled = !isAvailable;
  if (document.getElementById(TOGGLE_BUTTON) !== null) {
    document.getElementById(TOGGLE_BUTTON).disabled = !isAvailable;
  }
}

function askUserName() {
  createUserNamePromptMarkup();
  setOtherComponentsAvailability(false);
  document
    .getElementById(PROMPT_CONFIRM_BUTTON_ID)
    .addEventListener("click", function saveUserName() {
      var userName = document.getElementById(PROMPT_INPUT_ID).value;
      if (userName.length < 1){
        return;
      }
      config.userName = userName;
      document
        .getElementById(CHAT_ITEM)
        .removeChild(document.getElementById(USER_NAME_PROMPT_ID));
      setOtherComponentsAvailability(true);
      sendRequestToStorage(USER_NAME_FIELD, HTTP_PUT, config.userName);
    });
}

function getUserNameFromStorage() {
  sendRequestToStorage(USER_NAME_FIELD, HTTP_GET, "").then(
    function saveUserName(data) {
      config.userName = data;
    }
  );
}

function setUserName() {
  getUserNameFromStorage();
  setTimeout(function ifNotAssign() {
    if (
      config.userName !== null &&
      config.userName !== undefined &&
      config.userName !== ""
    ) {
      return;
    }
    if (config.requireName === "true") {
      askUserName();
    } else {
      config.userName = DEFAULT_USER_NAME;
      sendRequestToStorage(USER_NAME_FIELD, HTTP_PUT, config.userName);
    }
  }, REQUEST_TIMEOUT);
}

function expandChat() {
  document.getElementById(CHAT_ITEM).classList.remove(COLLAPSED);
  document.getElementById(CHAT_ITEM).classList.add(EXPANDED);
  if (config.allowMinimize === "true") {
    document.getElementById(TOGGLE_BUTTON).innerHTML = COLLAPSE_MARK;
  }
  appendMessagesList();
  appendInputBox();
  if (
    config.userName === "" ||
    config.userName === null ||
    config.userName === undefined
  ) {
    setUserName();
  }
  saveChatStateToStorage(EXPANDED);
}

function getChatStateFromStorage() {
  sendRequestToStorage(CHAT_STATE_FIELD, HTTP_GET, "").then(
    function saveChatState(data) {
      config.chatState = data;
    }
  );
}

function initChatState() {
  getChatStateFromStorage();
  setTimeout(function resolveChatState() {
    if (
      config.chatState === null ||
      config.chatState === undefined ||
      config.chatState === ""
    ) {
      saveChatStateToStorage(COLLAPSED);
    } else if (config.chatState === EXPANDED) {
      expandChat();
    }
    document.getElementById(CHAT_ITEM).classList.add(config.chatState);
  }, REQUEST_TIMEOUT);
}

function changeChatState() {
  switch (config.chatState) {
    case COLLAPSED:
      expandChat();
      break;
    case EXPANDED:
      collapseChat();
      break;
    default:
      throw new UnexpectedValueException(CHAT_ITEM, config.chatState);
  }
}

function appendStylesheet() {
  var styleElement = document.createElement("link");

  styleElement.rel = "stylesheet";
  styleElement.type = "text/css";
  styleElement.href = PATH_TO_STYLESHEET;
  document.head.appendChild(styleElement);
}

function appendToggleButton(container) {
  var toggleButton = document.createElement("button");
  toggleButton.className = TOGGLE_BUTTON;
  toggleButton.id = TOGGLE_BUTTON;
  toggleButton.innerHTML =
    config.chatState === EXPANDED ? COLLAPSE_MARK : EXPAND_MARK;
  toggleButton.addEventListener("click", changeChatState);
  container.appendChild(toggleButton);
}

function setDragHandler(container) {
  function getCoordinates(elem) {
    var box = elem.getBoundingClientRect();
    return {
      top: box.top + window.pageYOffset,
      left: box.left + window.pageXOffset
    };
  }

  container.addEventListener("mousedown", function onMouseDown(event) {
    var chat = document.getElementById(CHAT_ITEM);
    var coordinates = getCoordinates(chat);
    var shiftX = event.pageX - coordinates.left;
    var shiftY = event.pageY - coordinates.top;
    var mouseMoveHandler;
    var mouseUpHandler;

    if (event.target.tagName === "BUTTON") {
      return;
    }
    function moveAt(e) {
      chat.style.left = e.pageX - shiftX + "px";
      chat.style.top = e.pageY - shiftY + "px";
    }
    mouseMoveHandler = function onMouseMove(e) {
      moveAt(e);
    };
    mouseUpHandler = function onMouseUp() {
      document.removeEventListener("mousemove", mouseMoveHandler);
      container.removeEventListener("mouseup", mouseUpHandler);
    };
    moveAt(event);
    document.addEventListener("mousemove", mouseMoveHandler);
    container.addEventListener("mouseup", mouseUpHandler);
  });

  container.addEventListener("dragstart", function onDragStart() {
    return false;
  });
}

function createChatMarkup() {
  var container = document.createElement("fieldset");
  var legend = document.createElement("legend");
  var toggleButtonContainer = document.createElement("div");

  container.id = CHAT_ITEM;
  container.classList.add(
    "chat-container",
    getPositionClass(),
    config.cssClass
  );
  legend.innerHTML = config.chatTitle;
  legend.className = "chat-legend";
  container.appendChild(legend);
  toggleButtonContainer.className = "chat-toggle-button-container";
  if (config.allowDrag === "true") {
    toggleButtonContainer.classList.add("chat-toggle-button-container-drag");
    setDragHandler(toggleButtonContainer);
  }
  if (config.allowMinimize === "true") {
    appendToggleButton(toggleButtonContainer);
  } else if (config.allowMinimize === "false") {
    saveChatStateToStorage(EXPANDED);
  }
  container.appendChild(toggleButtonContainer);
  document.body.appendChild(container);
  initChatState();
}

function getParamsFromRequest() {
  var script = document.currentScript.src;
  return script
    .substr(script.indexOf("?") + 1)
    .split("&")
    .reduce(function reducer(param, el) {
      var parts = el.split("=");
      var value = decodeURIComponent(parts[1]);
      param[decodeURIComponent(parts[0])] = value.substr(1, value.length - 2);
      return param;
    }, {});
}

function setConfig() {
  var requestConfig = getParamsFromRequest();
  var propertyIndex;
  var properties;
  var propertyValue;
  properties = Object.keys(requestConfig);
  for (
    propertyIndex = 0;
    propertyIndex < properties.length;
    propertyIndex += 1
  ) {
    propertyValue = requestConfig[properties[propertyIndex]];
    if (propertyValue !== "") {
      config[properties[propertyIndex]] = propertyValue;
    }
  }
}

function setUniqueUserID() {
  if (localStorage.getItem(USER_ID) === null) {
    localStorage.setItem(USER_ID, "user".concat(Date.now().toString()));
  }
}

window.addEventListener("load", function initPage() {
  appendStylesheet();
  setUniqueUserID();
  createChatMarkup();
});

setConfig();
