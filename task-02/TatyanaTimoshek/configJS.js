var newConfig = {
  chatTitle: 'Chat',
  botName: 'Bot',
  chatUrl: 'https://tanyachatfb.firebaseio.com',
  cssClass: 'tsChatGreen',
  position: 'right',
  allowToMinimize: false,
  allowToDragAndDrop: false,
  requireName: false,
  showTime: false,
  networkXHR: true,
  networkFetch: false
};

var listener;

function createPage() {
  var importTag = document.createElement('div');
  importTag.id = 'idImportTag';
  importTag.innerHTML =
    '<div><div><div>Chat Title</div><input type="text" id="chatTitle"></div><div>' +
    '<div>Bot Name</div><input type="text" id="botName"></div><div>' +
    '<div>Chat URL</div><input type="text" id="chatUrl" value="https://tanyachatfb.firebaseio.com"></div>' +
    '<div><div>CSS class</div><input type="text" id="cssClass" value="tsChatOrange"></div>' +
    '<div><div>Position</div><select id="chatPositionSelect"><option id="idSelectRight">Right</option>' +
    '<option id="idSelectLeft">Left</option></select></div>' +
    '<div><div>Allow to minimize</div><div><input type="checkbox" id="allowToMinimize"></div>' +
    '<div>Allow drag</div><div><input type="checkbox" id="allowToDragAndDrop"></div>' +
    '<div>Require name</div><div><input type="checkbox" id="requireName"></div>' +
    '<div>Show time</div><div><input type="checkbox" id="showTime"></div></div>' +
    '<form action=""><div>XHR</div><input type="radio" name="contact" id="networkRadioXHR">' +
    '<div>fetch</div><input type="radio" name="contact" id="networkRadioFetch"></form></div>' +
    '<container><div id="generatedCode"></div></container>';
  document.body.appendChild(importTag);
}

function sendSettings() {
  var id = localStorage.getItem('idForTanyaChat');
  fetch(newConfig.chatUrl + '/settings/' + id + '/.json', {
    method: 'PUT',
    body: JSON.stringify(newConfig),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(res) {
      return res;
    });
}

function changeConfiguration() {
  var generatedCode = document.getElementById('generatedCode');
  generatedCode.innerText =
    '<script type="text/javascript" src="https://rawgit.com/TatyanaTimoshek/js--touchsoft/TanyaChatTwo/task-02/TatyanaTimoshek/chat.js"></script>\n' +
    '<script type="text/javascript">' +
    'newConfig = {\n' +
    '    chatTitle: "' +
    newConfig.chatTitle +
    '",\n' +
    '    botName: "' +
    newConfig.botName +
    '",\n' +
    '    chatURL: "' +
    newConfig.chatUrl +
    '",\n' +
    '    CSS: "' +
    newConfig.cssClass +
    '",\n' +
    '    position: "' +
    newConfig.position +
    '",\n' +
    '    allowToMinimize:' +
    newConfig.allowToMinimize +
    ',\n' +
    '    allowToDragAndDrop:' +
    newConfig.allowToDragAndDrop +
    ',\n' +
    '    requireName:' +
    newConfig.requireName +
    ',\n' +
    '    showTime:' +
    newConfig.showTime +
    ',\n' +
    '    networkFetch:' +
    newConfig.networkFetch +
    ',\n' +
    '    networkXHR:' +
    newConfig.networkXHR +
    ',\n' +
    '}</script>';
  sendSettings();
}

function applyConfiguration() {
  var chatTitle = document.getElementById('chatTitle');
  var botName = document.getElementById('botName');
  var chatUrl = document.getElementById('chatUrl');
  var cssClass = document.getElementById('cssClass');
  var chatPositionSelect = document.getElementById('chatPositionSelect');
  var allowToMinimize = document.getElementById('allowToMinimize');
  var allowToDragAndDrop = document.getElementById('allowToDragAndDrop');
  var requireName = document.getElementById('requireName');
  var showTime = document.getElementById('showTime');
  var xhr = document.getElementById('networkRadioXHR');
  var fetch = document.getElementById('networkRadioFetch');
  chatTitle.addEventListener('change', function() {
    if (chatTitle.value !== '' && chatTitle.value !== ' ') {
      newConfig.chatTitle = chatTitle.value;
      changeConfiguration();
    }
  });
  botName.addEventListener('change', function() {
    if (botName.value !== '' && botName.value !== ' ') {
      newConfig.botName = botName.value;
      changeConfiguration();
    }
  });
  chatUrl.addEventListener('change', function() {
    if (chatUrl.value !== '' && chatUrl.value !== ' ') {
      newConfig.chatUrl = chatUrl.value;
      changeConfiguration();
    }
  });
  cssClass.addEventListener('change', function() {
    if (cssClass.value !== '' && cssClass.value !== ' ') {
      newConfig.cssClass = cssClass.value;
      changeConfiguration();
    }
  });
  chatPositionSelect.addEventListener('change', function() {
    var position = chatPositionSelect.value;
    if (position === 'Left') {
      newConfig.position = 'left';
    } else {
      newConfig.position = 'right';
    }
    changeConfiguration();
  });
  allowToMinimize.addEventListener('change', function() {
    newConfig.allowToMinimize = allowToMinimize.checked;
    changeConfiguration();
  });
  allowToDragAndDrop.addEventListener('change', function() {
    newConfig.allowToDragAndDrop = allowToDragAndDrop.checked;
    changeConfiguration();
  });
  requireName.addEventListener('change', function() {
    newConfig.requireName = requireName.checked;
    changeConfiguration();
  });
  showTime.addEventListener('change', function() {
    newConfig.showTime = showTime.checked;
    changeConfiguration();
  });
  xhr.addEventListener('change', function() {
    newConfig.networkXHR = true;
    newConfig.networkFetch = false;
    changeConfiguration();
  });
  fetch.addEventListener('change', function() {
    newConfig.networkXHR = false;
    newConfig.networkFetch = true;
    changeConfiguration();
  });
}

listener = function done() {
  createPage();
  applyConfiguration();
  changeConfiguration();
};
document.addEventListener('DOMContentLoaded', listener);
