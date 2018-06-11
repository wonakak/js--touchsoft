var EVENT_NAME = "change";
var CHAT_TITLE_ID = "chat-configurator-chat-title";
var BOT_NAME_ID = "chat-configurator-bot-name";
var CHAT_URL_ID = "chat-configurator-chat-url";
var CHAT_CSS_CLASS_ID = "chat-configurator-chat-css-class";
var CHAT_POSITION_RIGHT_ID = "chat-configurator-chat-position-right";
var CHAT_POSITION_LEFT_ID = "chat-configurator-chat-position-left";
var CHAT_POSITION_ID = "chat-configurator-chat-position";
var ALLOW_MINIMIZE_ID = "chat-configurator-ui-minimize";
var ALLOW_DRAG_ID = "chat-configurator-ui-drag";
var REQUIRE_NAME_ID = "chat-configurator-ui-require-name";
var SHOW_DATE_TIME_ID = "chat-configurator-ui-show-date";
var NETWORK_XHR_ID = "chat-configurator-network-xhr";
var NETWORK_FETCH_ID = "chat-configurator-network-fetch";
var CODE_EXAMPLE_ID = "chat-configurator-code-source";
var CODE_EXAMPLE_START =
  '<script src="https://rawgit.com/Besomhead/js--touchsoft/besomhead-task-02/task-02/Besomhead/src/chat/chat.js?';
var CODE_EXAMPLE_END = '"></script>';

function getInputValue(componentID) {
  return "'".concat(document.getElementById(componentID).value).concat("'");
}

function getChatPosition() {
  var position = "position=";

  if (document.getElementById(CHAT_POSITION_RIGHT_ID).selected) {
    position = position
      .concat("'")
      .concat("right")
      .concat("'");
  } else if (document.getElementById(CHAT_POSITION_LEFT_ID).selected) {
    position = position
      .concat("'")
      .concat("left")
      .concat("'");
  }

  return position;
}

function getCheckBoxValue(componentID) {
  return document.getElementById(componentID).checked
    ? "'".concat("true").concat("'")
    : "'".concat("false").concat("'");
}

function getNetworkRequestType() {
  var requestType = "requests=";

  if (document.getElementById(NETWORK_XHR_ID).checked) {
    requestType = requestType
      .concat("'")
      .concat("xhr")
      .concat("'");
  } else if (document.getElementById(NETWORK_FETCH_ID).checked) {
    requestType = requestType
      .concat("'")
      .concat("fetch")
      .concat("'");
  }

  return requestType;
}

function createCodeExample() {
  document.getElementById(CODE_EXAMPLE_ID).value = CODE_EXAMPLE_START.concat(
    "chatTitle="
  )
    .concat(getInputValue(CHAT_TITLE_ID))
    .concat("&")
    .concat("botName=")
    .concat(getInputValue(BOT_NAME_ID))
    .concat("&")
    .concat("chatURL=")
    .concat(getInputValue(CHAT_URL_ID))
    .concat("&")
    .concat("cssClass=")
    .concat(getInputValue(CHAT_CSS_CLASS_ID))
    .concat("&")
    .concat(getChatPosition())
    .concat("&")
    .concat("allowMinimize=")
    .concat(getCheckBoxValue(ALLOW_MINIMIZE_ID))
    .concat("&")
    .concat("allowDrag=")
    .concat(getCheckBoxValue(ALLOW_DRAG_ID))
    .concat("&")
    .concat("requireName=")
    .concat(getCheckBoxValue(REQUIRE_NAME_ID))
    .concat("&")
    .concat("showDateTime=")
    .concat(getCheckBoxValue(SHOW_DATE_TIME_ID))
    .concat("&")
    .concat(getNetworkRequestType())
    .concat(CODE_EXAMPLE_END);
}

function initListeners() {
  document
    .getElementById(CHAT_TITLE_ID)
    .addEventListener(EVENT_NAME, createCodeExample);
  document
    .getElementById(BOT_NAME_ID)
    .addEventListener(EVENT_NAME, createCodeExample);
  document
    .getElementById(CHAT_URL_ID)
    .addEventListener(EVENT_NAME, createCodeExample);
  document
    .getElementById(CHAT_CSS_CLASS_ID)
    .addEventListener(EVENT_NAME, createCodeExample);
  document
    .getElementById(CHAT_POSITION_ID)
    .addEventListener("change", createCodeExample);
  document
    .getElementById(ALLOW_MINIMIZE_ID)
    .addEventListener(EVENT_NAME, createCodeExample);
  document
    .getElementById(ALLOW_DRAG_ID)
    .addEventListener(EVENT_NAME, createCodeExample);
  document
    .getElementById(SHOW_DATE_TIME_ID)
    .addEventListener(EVENT_NAME, createCodeExample);
  document
    .getElementById(REQUIRE_NAME_ID)
    .addEventListener(EVENT_NAME, createCodeExample);
  document
    .getElementById(NETWORK_XHR_ID)
    .addEventListener(EVENT_NAME, createCodeExample);
  document
    .getElementById(NETWORK_FETCH_ID)
    .addEventListener(EVENT_NAME, createCodeExample);
}

window.addEventListener("load", function initPage() {
  initListeners();
  createCodeExample();
});
