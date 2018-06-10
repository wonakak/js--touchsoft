window.TsChat = function MegaSuperUsefulChat(userConfig) {
  var generateUUID = function generateUUID0() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
        function replacement0(c) {
          var r = Math.random() * 16 | 0; // eslint-disable-line no-bitwise
          var v = c === 'x' ? r : (r & 0x3 | 0x8); // eslint-disable-line no-bitwise
          return v.toString(16);
        }).toUpperCase();
  };
  var config = {
    title: "Default Chat title",
    botName: "Agent",
    chatUrl: "url",
    cssClass: "YourCustomCss",
    position: "right",
    allowMinimize: false,
    allowDrag: false,
    showDateTime: false,
    requireName: false,
    userName: "Harry",
    nameVerified: false,
    requestsType: "fetch",
    databaseURL: "https://superchat-firebase.firebaseio.com",
    uuid: localStorage.getItem('client-uuid') || generateUUID(),
    maximized: localStorage.getItem('maximized') || '0',
    chat: "not rendered yet",
    msgsCount: 0,
    transcriptArray : null,
    viewMode : "client" // "dashboard"
  };
  var dbEndpoints = {
    userSettings: "settings",
    userMessages: "messages"
  };
  var isUser = function isUser0(record) {
    return record.src === 'u';
  };
  var Record = function Record(date, src, msg) {
    this.date = date;
    this.src = src;
    this.msg = msg;
  };
  var UserSettings = function UserSettings(uuid, maximized, name, msgsCount) {
    this.uuid = uuid;
    this.maximized = maximized;
    this.name = name;
    this.msgsCount = msgsCount;
  };

  function saveObjectToRemoteDatabase(endpoint, obj) {
    fetch(config.databaseURL + '/' + endpoint + '/' + config.uuid  + '.json',
        {
          method: 'PUT',
          body: JSON.stringify(obj),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
    .then(function response0(response) {
      return response.json();
    })
    .then(console.log); // eslint-disable-line no-console
  }

  function readObjectFromRemoteDatabase(endpoint, callback) {
    fetch(config.databaseURL + '/' + endpoint + '/' + config.uuid  + '.json',
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
    .then(function response0(response) {
      return response.json();
    })
    .then(callback)
  }

  // loadPageSection('fetch','./myPage.html', '#container', (result, err) => console.log(result, err));
  function loadPageSection(requestType, url, selector, callback) {
    var xhr;
    var finished;
    var xhrError;
    var useFetch = false;
    var section;
    var tmpEl;
    if (typeof url !== 'string') {
      throw new Error('Invalid URL: ' + url);
    } else if (!(typeof selector === 'string' || selector === null)) {
      throw new Error('Invalid selector selector: ' + selector);
    } else if (typeof callback !== 'function') {
      throw new Error('Callback provided is not a function: ' + callback);
    }
    if (requestType === "fetch") {
      useFetch = true;
    }

    if (useFetch) {
      fetch(url).then(function getResponseText(response) {
        return response.text();
      }).then(function findElementBySelector(htmlText) {
        if (selector !== null) {
          tmpEl = document.createElement('div');
          tmpEl.innerHTML = htmlText;
          section = tmpEl.querySelector(selector);
        } else {
          section = htmlText;
        }
        return section;
      }).then(callback);
    } else {
      xhr = new XMLHttpRequest();
      finished = false;
      xhrError = function xhrError0() {
        finished = true;
        callback(null, xhr.statusText);
      };
      xhr.onabort = xhrError;
      xhr.onerror = xhrError;
      xhr.onreadystatechange = function xhrStateChange() {
        if (xhr.readyState === 4 && !finished) {
          finished = true;
          if (selector !== null) {
            try {
              section = xhr.responseXML.querySelector(selector);
            } catch (e) {
              callback(null, e);
            }
          } else {
            section = xhr.responseXML;
          }
          callback(section);
        }
      };
      xhr.open('GET', url);
      xhr.responseType = 'document';
      xhr.send();
    }
  }

  function pad(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }

  function formatDate(date) {
    var d = new Date(date);
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(
        d.getUTCDate()) +
        ' ' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(
            d.getUTCSeconds());
  }

  function appendMessageToTranscriptTree(record) {
    var rowClass;
    var cellClass;
    var labelClass;
    var label;
    var tr;
    var transcriptList;
    if (isUser(record)) {
      rowClass = 'tr-client';
      cellClass = 'td-client';
      labelClass = 'user-label';
      label = config.userName;
    } else {
      rowClass = 'tr-agent';
      cellClass = 'td-agent';
      labelClass = 'agent-label';
      label = config.botName;
    }

    tr = document.createElement('tr');
    tr.classList.add(rowClass);
    tr.innerHTML = '<td class="' + cellClass + '">'
        + '<span class="' + labelClass + '">['
        + (config.showDateTime ? formatDate(record.date) + ' ' : '') + label
        + ']: </span>' + record.msg + '</td>';
    transcriptList = config.chat.querySelector('#transcript-list');
    transcriptList.appendChild(tr);
    config.msgsCount += 1; // update messages counter
  }

  function saveMessageToStorage(record) {
    config.transcriptArray.push(record);
    saveObjectToRemoteDatabase(dbEndpoints.userMessages, config.transcriptArray);
  }
/*
  function autoAnswerFromAgent(record) {
    var autoAnswer = new Record(null, 'a', 'Ответ на "'
        + record.msg.toUpperCase() + '"');
    setTimeout(function agentAutoAnswer() {
      autoAnswer.date = Date.now();
      saveMessageToStorage(autoAnswer);
      appendMessageToTranscriptTree(autoAnswer);
    }, 15000);
  }
*/
  function addedClientMessageToTranscript(/* record */) {
    // autoAnswerFromAgent(record);
  }

  function clickOnAgentSendButton() {
    var msg = 'agent answer';
    var record;
    if (msg !== '') {
      record = new Record(Date.now(), 'a', msg);
      saveMessageToStorage(record);
      appendMessageToTranscriptTree(record);
    }
  }

  function clickOnUserSendButton() {
    var userInput = config.chat.querySelector('#user-input');
    var msg = userInput.value;
    var record;
    if (msg !== '') {
      record = new Record(Date.now(), 'u', msg);
      saveMessageToStorage(record);
      appendMessageToTranscriptTree(record);
      userInput.value = '';
    }
    addedClientMessageToTranscript(record);
  }

  function handleMinMaxChat(maximize) {
    var minChat = config.chat.querySelector('#min-chat');
    var maxChat = config.chat.querySelector('#popup-chat');
    if (maximize) {
      minChat.classList.add("hidden-chat");
      maxChat.classList.remove("hidden-chat");
      localStorage.setItem('maximized', '1');
    } else {
      maxChat.classList.add("hidden-chat");
      minChat.classList.remove("hidden-chat");
      localStorage.setItem('maximized', '0');
    }
  }

  function minimizeChat() {
    handleMinMaxChat(false);
  }

  function maximizeChat() {
    handleMinMaxChat(true);
  }

  function clearTranscriptInStorageAndOnScreen() {
    var transcriptList = config.chat.querySelector('#transcript-list');
    transcriptList.innerHTML = "";
    config.transcriptArray = [];
    saveObjectToRemoteDatabase(dbEndpoints.userMessages, config.transcriptArray);
  }

  function dragElement(chat) {
    var pos1 = 0;
    var pos2 = 0;
    var pos3 = 0;
    var pos4 = 0;
    var headers;
    var i;

    function pauseEvent(e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      if (e.preventDefault) {
        e.preventDefault();
      }
      e.cancelBubble = true;
      e.returnValue = false;
      return false;
    }

    function elementDrag(e) {
      var ev = e || window.event;
      // calculate the new cursor position:
      pos1 = pos3 - ev.clientX;
      pos2 = pos4 - ev.clientY;
      pos3 = ev.clientX;
      pos4 = ev.clientY;
      // console.log("elementDrag: pos1=" + pos1 + ", pos2=" + pos2 + ", pos3=" + pos3 + ", pos4=" + pos4);
      // set the element's new position:
      chat.style.top = (chat.offsetTop - pos2) + "px";
      chat.style.left = (chat.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }

    function dragMouseDown(e) {
      var ev = e || window.event;
      pauseEvent(e);
      // get the mouse cursor position at startup:
      pos3 = ev.clientX;
      pos4 = ev.clientY;
      // console.log("dragMouseDown: pos3=" + pos3 + ", pos4=" + pos4);
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    headers = chat.querySelectorAll(".header");
    if (headers.length > 0) {
      for (i = 0; i < headers.length; i += 1) {
        headers[i].onmousedown = dragMouseDown;
      }
    } else {
      chat.onmousedown = dragMouseDown;
    }
  }

  function applyClientSettings() {
    var titles = config.chat.querySelectorAll("span.chat-header-title");
    var textArea;
    var person;
    var i;
    var userSettings;
    // make sure we have valid uuid on the start up.
    localStorage.setItem('client-uuid', config.uuid);

    for (i = 0; i < titles.length; i += 1) {
      titles[i].innerHTML = config.title;
    }
    if (config.requireName) {
      textArea = config.chat.querySelector("#user-input");
      textArea.addEventListener('focus', function inputName() {
        if (!config.nameVerified) {
          // eslint-disable-next-line no-alert
          person = prompt("Please enter your name", "Harry Potter");
          config.userName = person;
          config.nameVerified = true;
          userSettings = new UserSettings(config.uuid, config.maximized, config.userName, config.msgsCount);
          saveObjectToRemoteDatabase(dbEndpoints.userSettings, userSettings);
        }
      });
    }
    if (config.allowDrag) {
      dragElement(config.chat);
    }
    if (config.position === "left") {
      config.chat.style.left = "0";
      config.chat.style.right = "";
    } else {
      config.chat.style.left = "";
      config.chat.style.right = "0";
    }
    // save all settings
    userSettings = new UserSettings(config.uuid, config.maximized, config.userName, config.msgsCount);
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
    saveObjectToRemoteDatabase(dbEndpoints.userSettings, userSettings);
  }

  function processTranscriptResultFromStorage(transcriptJson) {
    var transcriptList =(transcriptJson !== null && transcriptJson !== undefined) ? transcriptJson : [];
    var index;
    for (index = 0; index < transcriptList.length; index += 1) {
      appendMessageToTranscriptTree(transcriptList[index]);
    }
    config.msgsCount = transcriptList.length;
    config.transcriptArray = transcriptList;
    applyClientSettings(); // should be called last, after everything is initialized
  }

  function loadAllTranscriptFromStorage() {
    readObjectFromRemoteDatabase(dbEndpoints.userMessages, processTranscriptResultFromStorage);
  }

  function addEventListenersToChat() {
    var sendButton = config.chat.querySelector('#user-send-button');
    // var agentSend = config.chat.querySelector('#agent-send-button');
    var maximize = config.chat.querySelector('#maximize');
    var minimize = config.chat.querySelector('#minimize');
    sendButton.addEventListener('click', clickOnUserSendButton);
    // agentSend.addEventListener('click', clickOnAgentSendButton);
    maximize.addEventListener('click', maximizeChat);
    minimize.addEventListener('click', minimizeChat);
    config.chat.querySelector('#clear1').addEventListener('click',
        clearTranscriptInStorageAndOnScreen);
    config.chat.querySelector('#clear2').addEventListener('click',
        clearTranscriptInStorageAndOnScreen);
  }

  function restoreChatSettingsAndTranscript() {
    var maximized = localStorage.getItem('maximized') || '0';
    handleMinMaxChat(maximized === '1');
    loadAllTranscriptFromStorage();
  }

  function readUserConfig() {
    var keys = Object.keys(userConfig);
    keys.forEach(function elementIds(attr) {
      config[attr] = userConfig[attr];
    });
  }

  function renderClientChatContainer() {
    loadPageSection(config.requestsType,
        'https://rawgit.com/wonakak/js--touchsoft/master/task-03/denism03/AllChatTemplates.html',
        'div.clientMainContainer',
        function appendChatContainerToPage(result, err) {
          if (err === null || err === undefined) {
            result.classList.add(config.cssClass);
            document.body.appendChild(result);
            config.chat = result;
            readUserConfig();
            addEventListenersToChat();
            restoreChatSettingsAndTranscript(); // promise callback
          } else {
            throw new Error('Cannot render chat container: ' + err);
          }
        }
    );
  }

  window.addEventListener('load', function InitializeMegaSuperUsefulChat() {
    console.log("View Mode = " + userConfig.viewMode);// eslint-disable-line no-console
    if (userConfig.viewMode === undefined || userConfig.viewMode === null ||  userConfig.viewMode === "client") {
      renderClientChatContainer();
    } else {
      console.log("AGENT DASHBOARD");// eslint-disable-line no-console
    }
  });
};