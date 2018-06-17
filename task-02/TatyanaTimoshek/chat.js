var config = {
  chatTitle: 'Chat',
  botName: 'Bot',
  chatURL: 'https://tanyachatfb.firebaseio.com',
  cssClass: 'tsChatGreen',
  position: 'left',
  allowToMinimize: false,
  allowToDragAndDrop: false,
  requireName: false,
  showTime: false,
  networkXHR: true,
  networkFetch: false
};

var tanyaChatStyles =
  '.yourChatWindowStyles {' +
  ' visibility: visible; ' +
  ' position: absolute;' +
  ' z-index: 99;' +
  ' width: 300px; ' +
  ' height: 450px; ' +
  ' background-color: white;' +
  ' bottom: 10px;' +
  ' border: 1px solid #369656;' +
  ' box-shadow: 0 0 5px 2px gray;' +
  '}' +
  '.yourChatLocationRight{' +
  ' right: 10px;' +
  '}' +
  '.yourChatRLocationLeft{' +
  ' left: 10px;' +
  '}' +
  '.chatWindowTableStyles {' +
  ' z-index: 99;' +
  ' border-collapse: collapse' +
  '}' +
  '.chatWindowTopTextStyles {' +
  ' height: 25px;' +
  ' font-family: sans-serif;' +
  ' background-color: white;' +
  ' padding-left: 15px' +
  '}' +
  '.chatWindowTopTextDragAndDrop{' +
  ' cursor: move;' +
  '}' +
  '.chatWindowTopMinimizeButtonStyles {' +
  ' background-color: white;' +
  ' padding-left: 10px' +
  '}' +
  '.minimizeButtonStyles {' +
  ' width: 30px;' +
  ' height: 15px;' +
  ' font-family: sans-serif;' +
  ' text-align: center;' +
  ' background: #7DD99D;' +
  ' cursor:pointer;' +
  ' border-radius: 2px;' +
  ' padding-bottom: 2px;' +
  ' box-shadow: 0.2em 0.2em 3px rgba(122,122,122,0.5);' +
  '}' +
  '.chatWindowMessagesHistoryTdStyles{' +
  ' width: 284.4px;' +
  ' font-family: sans-serif;' +
  ' border-style: hidden;' +
  ' overflow-y: scroll;' +
  ' word-wrap: break-word;' +
  ' height: 311px;' +
  ' padding: 7px;' +
  ' vertical-align: top;' +
  '}' +
  '.tsChatOrange{' +
  ' background-color: #F9AC0B;' +
  '}' +
  '.tsChatYellow{' +
  ' background-color: #FFFF00;' +
  '}' +
  '.tsChatGreen{' +
  ' background-color: #7DFF00;' +
  '}' +
  '.chatWindowMessageTerritoryTextStyles {' +
  ' width: 230px;' +
  ' height: 94px;' +
  ' background-color: white;' +
  ' padding-left: 7px;' +
  '}' +
  '.chatInputMessageStyles {' +
  ' width: 230px;' +
  ' height: 78px;' +
  ' font-family: sans-serif;' +
  ' resize: none;' +
  ' text-align: top;' +
  ' box-shadow: 0.2em 0.2em 3px rgba(122,122,122,0.5);' +
  '}' +
  '.chatWindowRequireName {' +
  ' position: fixed;' +
  ' width: 230px;' +
  ' height: 30px;' +
  ' padding-top: 10px;' +
  ' padding-bottom: 10px;' +
  ' font-size: 17pt;' +
  ' font-family: sans-serif;' +
  ' resize: none;' +
  ' bottom: 260px;' +
  ' z-index: 101;' +
  ' text-align: center;' +
  ' box-shadow: 0 0 5px 2px gray;' +
  '}' +
  '.chatWindowRequireNameLeft{' +
  ' left: 40px;' +
  '}' +
  '.chatWindowRequireNameRight{' +
  ' right: 40px;' +
  '}' +
  '.chatWindowHideHistory {' +
  ' position: fixed;' +
  ' width: 298px;' +
  ' height: 421px;' +
  ' background-color: #B4E3F8;' +
  ' bottom: 12px;' +
  ' z-index: 100;' +
  '}' +
  '.chatWindowHideHistoryLeft{' +
  ' left: 10px;' +
  '}' +
  '.chatWindowHideHistoryRight{' +
  ' right: 12px;' +
  '}' +
  '.chatWindowMessageTerritoryButtonStyles {' +
  ' width: 45px;' +
  ' height: 94px;' +
  ' background: white;' +
  '}' +
  '.sendButtonStyles{' +
  ' width: 42px;' +
  ' font-family: sans-serif;' +
  ' height: 50px;' +
  ' text-align: center;' +
  ' background: #7DD99D;' +
  ' cursor:pointer;' +
  ' border-radius: 2px;' +
  ' padding-top: 35px;' +
  ' box-shadow: 0.2em 0.2em 3px rgba(122,122,122,0.5);' +
  '}' +
  '.enterButtonStyles{' +
  ' position: fixed;' +
  ' background-color: red;' +
  ' bottom: 200px;' +
  ' z-index: 101;' +
  ' font-size: 17pt;' +
  ' width: 170px;' +
  ' font-family: sans-serif;' +
  ' height: 35px;' +
  ' text-align: center;' +
  ' background: #38C214;' +
  ' cursor:pointer;' +
  ' padding-top: 8px;' +
  ' border-radius: 2px;' +
  ' box-shadow: 0 0 5px 2px #42513D;' +
  '}' +
  '.enterButtonStylesLeft{' +
  ' left: 73px;' +
  '}' +
  '.enterButtonStylesRight{' +
  ' right: 73px;' +
  '}' +
  '.minimizeWindowStyles {' +
  ' position: fixed;' +
  ' z-index: 99;' +
  ' width: 300px;' +
  ' height: 25px;' +
  ' background-color: white;' +
  ' bottom: 10px;' +
  ' visibility: hidden;' +
  ' border: 1px solid #369656;' +
  ' box-shadow: 0 0 5px 2px gray; ' +
  '}' +
  '.minimizeWindowLocationRight{' +
  ' right: 330px;' +
  '}' +
  '.minimizeWindowLocationLeft{' +
  ' left: 330px;' +
  '}' +
  '.minimizeChatStyles {' +
  ' z-index: 99;' +
  ' border-collapse: collapse;' +
  '}' +
  '.minimizeChatTextStyles {' +
  ' width: 300px;' +
  ' font-family: sans-serif;' +
  ' height: 23px;' +
  ' background-color: white;' +
  ' padding-left: 15px;' +
  '}' +
  '.minimizeChatButtonTdStyles {' +
  ' background-color: white;' +
  ' padding-right: 5px;' +
  ' padding-bottom: 3px;' +
  '}' +
  '.minButtonStyles {' +
  ' width: 30px;' +
  ' height: 15px;' +
  ' text-align: center;' +
  ' background: #7DD99D;' +
  ' cursor: pointer;' +
  ' border-radius: 2px;' +
  ' font-family: sans-serif;' +
  ' padding-bottom: 5px;' +
  ' font-size: 15px;' +
  ' padding-right: 3px;' +
  ' padding-left: 3px;' +
  ' box-shadow: 0.2em 0.2em 3px rgba(122,122,122,0.5);' +
  '}';

var aboutUser;
var info;
var tofb;

function generateId() {
  return Math.random()
    .toString(36)
    .substr(2, 9);
}

function findId() {
  var yourId;
  if (localStorage.getItem('idForTanyaChat') !== null)
    yourId = localStorage.getItem('idForTanyaChat');
  else {
    yourId = generateId();
    localStorage.setItem('idForTanyaChat', yourId);
  }
  return yourId;
}

aboutUser = {
  userName: 'You',
  userId: findId(),
  minChat: false,
  online: false,
  unreadMessages: false
};

info = {
  messagesUrl: config.chatURL + '/messages/' + aboutUser.userId + '/.json',
  chatStatusUrl: config.chatURL + '/chatStatus/' + aboutUser.userId + '/.json',
  usersUrl: config.chatURL + '/users/' + aboutUser.userId + '/.json',
  settingsUrl: config.chatURL + '/settings/' + aboutUser.userId + '/.json',
  requestPost: 'POST',
  requestGet: 'GET',
  requestPatch: 'PATCH',
  requestPut: 'PUT',
  messagesQueue: []
};

tofb = {
  time: '14:19',
  sender: 'Tan',
  text: 'letter'
};

// localStorage.removeItem('idForTanyaChat');

function createStyles() {
  var cssStyles = document.createElement('style');
  cssStyles.id = 'idStylesTanyaChat';
  cssStyles.innerHTML = tanyaChatStyles;
  document.body.appendChild(cssStyles);
  return cssStyles;
}

function createChat() {
  var yourChatWindow = document.createElement('div');
  var chatWindowTable = document.createElement('table');
  var chatWindowTop = document.createElement('tr');
  var chatWindowTopText = document.createElement('td');
  var chatWindowTopMinimizeButton = document.createElement('td');
  var minimizeButton = document.createElement('div');
  var chatWindowMessagesHistory = document.createElement('tr');
  var chatWindowMessagesHistoryTd = document.createElement('td');
  var history = document.createElement('div');
  var chatWindowMessageTerritory = document.createElement('tr');
  var chatWindowMessageTerritoryText = document.createElement('td');
  var chatInputMessage = document.createElement('textarea');
  var chatWindowMessageTerritoryButton = document.createElement('td');
  var sendButton = document.createElement('div');
  var meta = document.createElement('meta');

  yourChatWindow.id = 'idChatWindow';
  yourChatWindow.classList.add('yourChatWindowStyles');
  if (config.position === 'left') {
    yourChatWindow.classList.add('yourChatLocationLeft');
  } else {
    yourChatWindow.classList.add('yourChatLocationRight');
  }
  document.body.appendChild(yourChatWindow);

  chatWindowTable.classList.add('chatWindowTableStyles');

  chatWindowTop.id = 'idChatWindowTop';

  chatWindowTopText.id = 'idChatWindowTopText';
  chatWindowTopText.classList.add('chatWindowTopTextStyles');
  if (config.allowToDragAndDrop) {
    chatWindowTopText.classList.add('chatWindowTopTextDragAndDrop');
  }

  chatWindowTopText.innerHTML = config.chatTitle;

  chatWindowTopMinimizeButton.id = 'idChatWindowTopMinimizeButton';

  chatWindowTopMinimizeButton.classList.add(
    'chatWindowTopMinimizeButtonStyles'
  );
  minimizeButton.id = 'idMinimizeButton';
  if (config.allowToMinimize === true) {
    minimizeButton.classList.add('minimizeButtonStyles');
    minimizeButton.innerHTML = '&#8212';
  }
  chatWindowTopMinimizeButton.appendChild(minimizeButton);

  chatWindowTop.appendChild(chatWindowTopText);
  chatWindowTop.appendChild(chatWindowTopMinimizeButton);

  chatWindowMessagesHistory.id = 'idChatWindowMessagesHistory';
  history.id = 'idHistoryOfTanyaChat';
  history.classList.add('chatWindowMessagesHistoryTdStyles');
  history.classList.add(config.cssClass);
  chatWindowMessagesHistoryTd.colSpan = '2';
  chatWindowMessagesHistoryTd.appendChild(history);

  chatWindowMessagesHistory.appendChild(chatWindowMessagesHistoryTd);

  chatWindowMessageTerritory.id = 'idChatWindowMessageTerritory';

  chatWindowMessageTerritoryText.id = 'idChatWindowMessageTerritoryText';
  chatWindowMessageTerritoryText.classList.add(
    'chatWindowMessageTerritoryTextStyles'
  );
  chatInputMessage.id = 'idChatInputMessage';
  chatInputMessage.type = 'text';
  chatInputMessage.placeholder = 'Enter your message..';
  chatInputMessage.classList.add('chatInputMessageStyles');
  chatWindowMessageTerritoryText.appendChild(chatInputMessage);

  chatWindowMessageTerritoryButton.classList.add(
    'chatWindowMessageTerritoryButtonStyles'
  );
  sendButton.id = 'idSendButton';
  sendButton.classList.add('sendButtonStyles');
  sendButton.innerHTML = 'Send';
  chatWindowMessageTerritoryButton.appendChild(sendButton);

  chatWindowMessageTerritory.appendChild(chatWindowMessageTerritoryText);
  chatWindowMessageTerritory.appendChild(chatWindowMessageTerritoryButton);

  meta.httpEquiv = 'Content-Type';
  meta.content = 'text/html; charset=utf-8';
  chatWindowTable.appendChild(meta);

  chatWindowTable.appendChild(chatWindowTop);
  chatWindowTable.appendChild(chatWindowMessagesHistory);
  chatWindowTable.appendChild(chatWindowMessageTerritory);

  yourChatWindow.appendChild(chatWindowTable);
  chatInputMessage.focus();
  document.getElementById(
    'idHistoryOfTanyaChat'
  ).scrollTop = document.getElementById('idHistoryOfTanyaChat').scrollHeight;
  return yourChatWindow;
}

function createMinimizeWindow() {
  var minimizeWindow = document.createElement('div');
  var minimizeChat = document.createElement('table');
  var minimizeChatPane = document.createElement('tr');
  var minimizeChatText = document.createElement('td');
  var minimizeChatButtonTd = document.createElement('td');
  var minButton = document.createElement('div');

  minimizeWindow.id = 'idMinimizeWindow';
  minimizeWindow.classList.add('minimizeWindowStyles');
  if (config.position === 'left') {
    minimizeWindow.classList.add('minimizeWindowLocationLeft');
  } else {
    minimizeWindow.classList.add('minimizeWindowLocationRight');
  }
  minimizeChat.classList.add('minimizeChatStyles');

  minimizeChatPane.id = 'idMinimizeChatPane';

  minimizeChatText.id = 'idMinimizeChatText';
  minimizeChatText.classList.add('minimizeChatTextStyles');
  minimizeChatText.innerHTML = 'Chat';

  minimizeChatButtonTd.id = 'idMinimizeChatButtonTd';
  minimizeChatButtonTd.classList.add('minimizeChatButtonTdStyles');
  minButton.id = 'idMinButton';
  minButton.classList.add('minButtonStyles');
  minButton.innerHTML = '[&nbsp&nbsp]';
  minimizeChatButtonTd.appendChild(minButton);

  minimizeChatPane.appendChild(minimizeChatText);
  minimizeChatPane.appendChild(minimizeChatButtonTd);
  minimizeChat.appendChild(minimizeChatPane);
  minimizeWindow.appendChild(minimizeChat);

  document.body.appendChild(minimizeWindow);
  return minimizeWindow;
}

function DragAndDrop(elem) {
  var x;
  var y;
  var left1;
  var top1;
  if (!elem.style.cursor === 'move') return;
  document.onmousedown = function() {
    return false;
  };
  elem.style.cursor = 'move';
  document.onmousemove = function(myelement) {
    x = myelement.pageX;
    y = myelement.pageY;
    left1 = elem.offsetLeft;
    top1 = elem.offsetTop;
    left1 = x - left1;
    top1 = y - top1;
    document.onmousemove = function(element) {
      x = element.pageX;
      y = element.pageY;
      elem.style.top = y - top1 + 'px';
      elem.style.left = x - left1 + 'px';
    };
  };
  document.onmouseup = function() {
    elem.style.cursor = 'auto';
    document.onmousedown = function() {};
    document.onmousemove = function() {};
  };
}

function dad() {
  DragAndDrop(document.getElementById('idChatWindow'));
}

function setVisibility() {
  if (!aboutUser.minChat) {
    document.getElementById('idChatWindow').style.visibility = 'visible';
    document.getElementById('idMinimizeWindow').style.visibility = 'hidden';
  } else {
    document.getElementById('idChatWindow').style.visibility = 'hidden';
    document.getElementById('idMinimizeWindow').style.visibility = 'visible';
  }
}

function scrollDown() {
  document.getElementById(
    'idHistoryOfTanyaChat'
  ).scrollTop = document.getElementById('idHistoryOfTanyaChat').scrollHeight;
}

function addMes(time, sender, text) {
  var raw;
  var h = document.getElementById('idHistoryOfTanyaChat');
  var man = sender;
  if (man === 'Bot' && config.botName !== 'Bot') man = config.botName;
  if (man === 'You' && aboutUser.userName !== 'You') {
    man = aboutUser.userName;
    console.log('ab ' + aboutUser.userName);
    console.log('sen ' + man);
  }
  raw = config.showTime ? time + ' ' : ' ';
  h.innerHTML = h.innerHTML + raw + man + ': ' + text + '<br>';
  scrollDown();
}

function postMyDataFetch(url, requestType, data) {
  var body;
  if (requestType !== 'GET') {
    body = {
      method: requestType,
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
  } else {
    body = {
      method: requestType,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
  }
  return fetch(url, body)
    .then(function(response) {
      return response.json();
    })
    .then(function(res) {
      return res;
    });
}

function postMyDataXHR(url, requestType, data) {
  var request;
  return new Promise(function(resolve) {
    request = new XMLHttpRequest();
    request.open(requestType, url, true);
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Content-Type', 'application/json');
    request.addEventListener('load', function() {
      resolve(JSON.parse(request.response));
    });
    request.send(JSON.stringify(data));
  });
}

function postMyData(url, requestType, data) {
  var typeOfRequest;
  if (config.networkFetch)
    typeOfRequest = postMyDataFetch(url, requestType, data);
  else typeOfRequest = postMyDataXHR(url, requestType, data);
  return typeOfRequest;
}

function findUserAndGetChatStatus(url, requestType) {
  var id;
  postMyData(url, requestType, aboutUser).then(function(users) {
    id = localStorage.getItem('idForTanyaChat');
    if (users !== null && id !== null) {
      if (users.userId === id) {
        aboutUser.userName = users.userName;
        aboutUser.minChat = users.minChat;
      }
    }
  });
}

function getMessage(url, requestType) {
  postMyData(url, requestType, tofb).then(function(messages) {
    if (messages !== null) {
      Object.keys(messages).forEach(function(message) {
        addMes(
          messages[message].time,
          messages[message].sender,
          messages[message].text
        );
      });
    }
  });
}

function forMinButton() {
  if (aboutUser.minChat === false) {
    document.getElementById('idChatWindow').style.visibility = 'hidden';
    document.getElementById('idMinimizeWindow').style.visibility = 'visible';
    aboutUser.minChat = true;
    postMyData(info.usersUrl, info.requestPut, aboutUser);
  } else {
    document.getElementById('idChatWindow').style.visibility = 'visible';
    document.getElementById('idMinimizeWindow').style.visibility = 'hidden';
    aboutUser.minChat = false;
    postMyData(info.usersUrl, info.requestPut, aboutUser);
  }
}

function botAnswer() {
  var currentTime = new Date();
  while (info.messagesQueue.length !== 0) {
    tofb.sender = config.botName;
    tofb.time = currentTime.getHours() + ':' + currentTime.getMinutes();
    tofb.text =
      ' Response to "' + info.messagesQueue.shift().toUpperCase() + '"';
    addMes(tofb.time, tofb.sender, tofb.text);
    postMyData(info.messagesUrl, info.requestPost, tofb);
    scrollDown();
  }
}

function sendMessage() {
  var currentTime = new Date();
  var hangOnTenSeconds = 10000;
  var message = document.getElementById('idChatInputMessage').value;
  tofb.sender = aboutUser.userName;
  tofb.time = currentTime.getHours() + ':' + currentTime.getMinutes();
  tofb.text = message;
  addMes(tofb.time, tofb.sender, tofb.text);
  postMyData(info.messagesUrl, info.requestPost, tofb);
  scrollDown();
  info.messagesQueue.push(tofb.text);
  document.getElementById('idChatInputMessage').value = '';
  setTimeout(botAnswer, hangOnTenSeconds);
}

function setOnclickFunctions() {
  document.getElementById('idMinimizeButton').onclick = forMinButton;
  document.getElementById('idMinButton').onclick = forMinButton;
  document.getElementById('idSendButton').onclick = sendMessage;
}

function disableSettings() {
  if (config.allowToDragAndDrop) {
    document.getElementById('idChatWindowTopText').style.cursor = 'auto';
  }
  document.getElementById('idMinimizeButton').onclick = function() {};
}

function restoreSettings() {
  if (config.allowToDragAndDrop) {
    document.getElementById('idChatWindowTopText').style.cursor = 'move';
    if (config.allowToDragAndDrop) {
      document
        .getElementById('idChatWindowTopText')
        .addEventListener('mousedown', dad);
    }
  }
  document.getElementById('idMinimizeButton').onclick = forMinButton;
}

function createRequireNameWindow() {
  var inputNameField = document.createElement('textarea');
  var hideHistoryPane = document.createElement('div');
  var enterName = document.createElement('div');
  inputNameField.id = 'idInputNameField';
  hideHistoryPane.id = 'idHideHistoryPane';
  enterName.id = 'idEnterName';

  enterName.classList.add('enterButtonStyles');
  enterName.innerHTML = 'Log in';
  hideHistoryPane.classList.add('chatWindowHideHistory');
  inputNameField.classList.add('chatWindowRequireName');
  inputNameField.placeholder = 'Enter your name..';

  if (config.position === 'left') {
    enterName.classList.add('enterButtonStylesLeft');
    hideHistoryPane.classList.add('chatWindowHideHistoryLeft');
    inputNameField.classList.add('chatWindowRequireNameLeft');
  } else {
    enterName.classList.add('enterButtonStylesRight');
    hideHistoryPane.classList.add('chatWindowHideHistoryRight');
    inputNameField.classList.add('chatWindowRequireNameRight');
  }
  document.body.appendChild(hideHistoryPane);
  document.body.appendChild(inputNameField);
  document.body.appendChild(enterName);
}

function hideRequireNameWindow() {
  document.getElementById('idHideHistoryPane').style.visibility = 'hidden';
  document.getElementById('idInputNameField').style.visibility = 'hidden';
  document.getElementById('idEnterName').style.visibility = 'hidden';
}

function workWithEnteredName() {
  var name = document.getElementById('idInputNameField').value;
  if (name !== null && name !== ' ') {
    console.log('good');
    aboutUser.userName = name;
    postMyData(info.usersUrl, info.requestPut, aboutUser);
    hideRequireNameWindow();
    restoreSettings();
  } else console.log('bad');
}

function requireNameFunction() {
  disableSettings();
  if (!config.requireName) {
    findUserAndGetChatStatus(info.usersUrl, info.requestGet);
    restoreSettings();
    return;
  }
  findUserAndGetChatStatus(info.usersUrl, info.requestGet);
  createRequireNameWindow();
  document.getElementById('idEnterName').onclick = workWithEnteredName;
}

function checkFind() {
  if (aboutUser.userName !== 'You') {
    hideRequireNameWindow();
  }
}

function init() {
  var holdOn = 700;
  createStyles();
  createChat();
  requireNameFunction();
  createMinimizeWindow();
  getMessage(info.messagesUrl, info.requestGet);
  scrollDown();
  setOnclickFunctions();
  setTimeout(checkFind, holdOn);
  restoreSettings();
  setTimeout(setVisibility, holdOn);
}

function acceptNewSettings() {
  console.log('new');
  postMyDataFetch(info.settingsUrl, info.requestGet, config).then(function(
    newConfig
  ) {
    if (newConfig !== null) {
      config.chatTitle = newConfig.chatTitle;
      config.botName = newConfig.botName;
      config.chatUrl = newConfig.chatUrl;
      config.cssClass = newConfig.cssClass;
      config.position = newConfig.position;
      config.allowToMinimize = newConfig.allowToMinimize;
      config.allowToDragAndDrop = newConfig.allowToDragAndDrop;
      config.requireName = newConfig.requireName;
      config.showTime = newConfig.showTime;
      config.networkXHR = newConfig.networkXHR;
      config.networkFetch = newConfig.networkFetch;
    }
  });
}

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var holdOn = 700;
    acceptNewSettings();
    setTimeout(init, holdOn);
  });
})();
