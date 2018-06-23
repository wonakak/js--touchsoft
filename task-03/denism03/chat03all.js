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
    requireName: true,
    userName: "DefaultUserName",
    nameVerified: false,
    requestsType: "fetch",
    databaseURL: "https://superchat-firebase.firebaseio.com",
    uuid: localStorage.getItem('client-uuid') || generateUUID(),
    maximized: localStorage.getItem('maximized') || '0',
    chat: "not rendered yet",
    transcriptArray: [],
    loadCompleted: false
  };
  var dbEndpoints = {
    userSettings: "settings",
    userMessages: "messages",
    userProfile: "profile"
  };
  var FULL_PROFILE_ENDPOINT = dbEndpoints.userProfile + '/' + config.uuid + '.json';
  var PROFILE_SETTINGS_ENDPOINT = dbEndpoints.userProfile + '/' + config.uuid + '/' + dbEndpoints.userSettings + '.json';
  var PROFILE_TRANSCRIPT_ENDPOINT = dbEndpoints.userProfile + '/' + config.uuid + '/' + dbEndpoints.userMessages + '.json';

  var dbHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };
  var READY_STATE_DONE = 4;
  var isUser = function isUser0(record) {
    return record.src === 'u';
  };
  var Record = function Record(date, src, msg) {
    this.date = date;
    this.src = src;
    this.msg = msg;
  };
  var UserSettings = function UserSettings0(uuid, maximized, name, msgsCount) {
    this.uuid = uuid;
    this.maximized = maximized;
    this.name = name;
    this.msgsCount = msgsCount;
  };

  function $$(chatElementSelector) {
    return config.chat.querySelector(chatElementSelector);
  }

  function defaultErrorHandler(response) {
    console.log(response); // eslint-disable-line no-console
  }

  function executeXhrRequest(endpoint, method, headers, body, responseType, shouldReturnJson, errHandler, successHandler) {
    var xhr;
    var finished;
    var xhrError;
    var keyIndex;
    var keys;
    xhr = new XMLHttpRequest();
    finished = false;
    xhrError = function xhrError0() {
      finished = true;
      console.log("ERROR xhr " + method + " " + endpoint); // eslint-disable-line no-console
      console.log(xhr.statusText); // eslint-disable-line no-console
      if (errHandler !== undefined && errHandler !== null) {
        errHandler(xhr);
      }
    };
    xhr.onabort = xhrError;
    xhr.onerror = xhrError;
    xhr.onreadystatechange = function xhrStateChange() {
      if (xhr.readyState === READY_STATE_DONE && !finished) {
        console.log("DONE xhr " + method + " " + endpoint); // eslint-disable-line no-console
        finished = true;
        if (successHandler !== undefined && successHandler !== null) {
          successHandler(shouldReturnJson ? JSON.parse(xhr.responseText) : xhr);
        }
      }
    };

    xhr.open(method, endpoint);
    if (responseType !== undefined && responseType !== null) {
      xhr.responseType = responseType;
    }
    if (headers !== undefined && headers !== null) {
      keys = Object.keys(headers);
      for (keyIndex = 0; keyIndex < keys.length; keyIndex += 1) {
        xhr.setRequestHeader(keys[keyIndex], headers[keys[keyIndex]]);
      }
    }
    if (body !== undefined && body !== null && method !== "GET" && method !== "get") {
      xhr.send(body);
    } else {
      xhr.send();
    }
  }

  function executeFetchRequest(endpoint, zmethod, zheaders, zbody, responseType, shouldReturnJson, errHandler, successHandler) {
    var params = {
      method: zmethod || "GET"
    };
    if (zheaders !== undefined && zheaders !== null) {
      params.headers = zheaders;
    }
    if (zbody !== undefined && zbody !== null && zmethod !== "GET" && zmethod !== "get") {
      params.body = zbody;
    }
    fetch(endpoint, params)
    .then(function response0(response) {
      console.log("DONE fetch " + zmethod + " " + endpoint); // eslint-disable-line no-console
      return shouldReturnJson ? response.json() : response.text();
    })
    .then(function processResult0(data) {
      if (successHandler !== undefined && successHandler !== null) {
        successHandler(data)
      }
    })
    .catch(function response1(response) {
      console.log("ERROR fetch " + zmethod + " " + endpoint); // eslint-disable-line no-console
      // response.text().then(function processError1(data) {
      if (errHandler !== undefined && errHandler !== null) {
        errHandler(response);
      }
      // });
    });
  }

  function saveObjectToRemoteDatabase(endpoint, obj) {
    var replaceWholeObjectEndpoint = config.databaseURL + '/' + endpoint;
    if (config.requestsType === "fetch") {
      executeFetchRequest(replaceWholeObjectEndpoint,
          'PUT', dbHeaders, JSON.stringify(obj), "text", false, defaultErrorHandler, null)
    } else {
      executeXhrRequest(replaceWholeObjectEndpoint,
          'PUT', dbHeaders, JSON.stringify(obj), "text", false, defaultErrorHandler, null);
    }
  }

  function pushMsgToUserProfile(obj) {
    var replaceWholeObjectEndpoint = config.databaseURL + '/' + PROFILE_TRANSCRIPT_ENDPOINT;
    if (config.requestsType === "fetch") {
      executeFetchRequest(replaceWholeObjectEndpoint,
          'POST', dbHeaders, JSON.stringify(obj), "text", false, defaultErrorHandler, null)
    } else {
      executeXhrRequest(replaceWholeObjectEndpoint,
          'POST', dbHeaders, JSON.stringify(obj), "text", false, defaultErrorHandler, null);
    }
  }

  function readObjectFromRemoteDatabaseAndReturnJson(endpoint, callback) {
    var readObjectEndpoint = config.databaseURL + '/' + endpoint;
    if (config.requestsType === "fetch") {
      executeFetchRequest(readObjectEndpoint,
          'GET', dbHeaders, null, 'text', true, defaultErrorHandler, callback)
    } else {
      executeXhrRequest(readObjectEndpoint,
          'GET', dbHeaders, null, 'text', true, defaultErrorHandler, callback);
    }
  }

  function loadPageSection(requestType, url, selector, callback) {
    var section;
    var tmpEl;
    if (typeof url !== 'string') {
      throw new Error('Invalid URL: ' + url);
    } else if (!(typeof selector === 'string' || selector === null)) {
      throw new Error('Invalid selector selector: ' + selector);
    } else if (typeof callback !== 'function') {
      throw new Error('Callback provided is not a function: ' + callback);
    }
    if (config.requestsType === "fetch") {
      executeFetchRequest(url, 'GET', null, null, 'document', false, defaultErrorHandler, function processDomTree0(htmlText) {
        if (selector !== null) {
          tmpEl = document.createElement('div');
          tmpEl.innerHTML = htmlText;
          section = tmpEl.querySelector(selector);
        } else {
          section = htmlText; // TODO adjust callback to process text
        }
        callback(section);
      });
    } else {
      executeXhrRequest(url, 'GET', null, null, 'document', false, defaultErrorHandler, function processDomTree0(xhr) {
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
      });
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
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) +
        ' ' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds());
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
    tr.innerHTML = '<td class="' + cellClass + '">' + '<span class="' + labelClass + '">['
        + (config.showDateTime ? formatDate(record.date) + ' ' : '') + label + ']: </span>' + record.msg + '</td>';
    transcriptList = $$('#transcript-list');
    transcriptList.appendChild(tr);
  }

  function saveMessageToStorage(record) {
    config.transcriptArray.push(record);
    pushMsgToUserProfile(record);
  }

  /*
      function autoAnswerFromAgent(record) {
          var autoAnswer = new Record(null, 'a', 'Ответ на "' + record.msg.toUpperCase() + '"');
          setTimeout(function agentAutoAnswer() {
              autoAnswer.date = Date.now();
              saveMessageToStorage(autoAnswer);
              appendMessageToTranscriptTree(autoAnswer);
          }, 5000);
      }

      function addedClientMessageToTranscript(record) {
          autoAnswerFromAgent(record);
      }
  */
  function clickOnAgentSendButton() {
    var msg = 'agent answer';
    var record;
    if (config.loadCompleted) {
      if (msg !== '') {
        record = new Record(Date.now(), 'a', msg);
        saveMessageToStorage(record);
        // appendMessageToTranscriptTree(record);
      }
    } else {
      alert("Loading in progress! Please wait a bit..."); // eslint-disable-line no-alert
    }
  }

  function clickOnUserSendButton() {
    var userInput = $$('#user-input');
    var msg = userInput.value;
    var record;
    if (config.loadCompleted) {
      if (msg !== '') {
        record = new Record(Date.now(), 'u', msg);
        saveMessageToStorage(record);
        appendMessageToTranscriptTree(record);
        userInput.value = '';
        // addedClientMessageToTranscript(record);
      }
    } else {
      alert("Loading in progress! Please wait a bit..."); // eslint-disable-line no-alert
    }
  }

  function handleMinMaxChat(maximize) {
    var minChat = $$('#min-chat');
    var maxChat = $$('#popup-chat');
    if (maximize) {
      minChat.classList.add("hidden-chat");
      maxChat.classList.remove("hidden-chat");
      config.maximized = 1;
    } else {
      maxChat.classList.add("hidden-chat");
      minChat.classList.remove("hidden-chat");
      config.maximized = 0;
    }
  }

  function minimizeChat() {
    handleMinMaxChat(false);
  }

  function maximizeChat() {
    handleMinMaxChat(true);
  }

  function clearTranscriptInStorageAndOnScreen() {
    var transcriptList = $$('#transcript-list');
    transcriptList.innerHTML = "";
    config.transcriptArray = [];
    // clear messages in database
    saveObjectToRemoteDatabase(PROFILE_TRANSCRIPT_ENDPOINT, config.transcriptArray);
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

  function processUserSettingsResultFromStorage(userSettings) {
    var textArea;
    var person;
    var updatedSettings;
    var titles = config.chat.querySelectorAll("span.chat-header-title");
    var i;
    localStorage.setItem('client-uuid', userSettings.uuid || config.uuid);
    for (i = 0; i < titles.length; i += 1) {
      titles[i].innerHTML = config.title;
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
    if (!config.nameVerified) {
      if (userSettings.name !== undefined && userSettings.name !== null && userSettings.name !== "") {
        config.userName = userSettings.name;
        config.nameVerified = true;
      } else if (config.requireName) {
        textArea = $$("#user-input");
        textArea.addEventListener('focus', function inputName() {
          // eslint-disable-next-line no-alert
          person = prompt("Please enter your name", "Harry Potter");
          config.userName = person;
          config.nameVerified = true;
          updatedSettings = new UserSettings(config.uuid, config.maximized, config.userName, config.transcriptArray.length);
          saveObjectToRemoteDatabase(PROFILE_SETTINGS_ENDPOINT, updatedSettings);
        });
      }
    }
  }

  function processTranscriptResultFromStorage(transcriptJson) {
    var transcriptList = (transcriptJson !== null && transcriptJson !== undefined) ? Object.values(transcriptJson) : [];
    var index;
    // TODO possibly sort() is required
    // if (transcriptList.length > 0) {
    //   transcriptList.innerHTML = "";
    //   config.transcriptArray = transcriptList;
    // }
    for (index = config.transcriptArray.length - 1; index < transcriptList.length; index += 1) {
      appendMessageToTranscriptTree(transcriptList[index]);
    }
    config.transcriptArray = transcriptList;
  }

  function processUserProfileFromStorage(profile) {
    var defaultSettings;
    if (profile !== undefined && profile !== null) {
      processUserSettingsResultFromStorage(profile.settings);
      processTranscriptResultFromStorage(profile.messages);
    } else {
      console.log("Empty user profile !!");  // eslint-disable-line no-console
      defaultSettings = new UserSettings(
          config.uuid, config.maximized, config.userName, config.transcriptArray.length);
      saveObjectToRemoteDatabase(PROFILE_SETTINGS_ENDPOINT, defaultSettings);
      processUserSettingsResultFromStorage(defaultSettings);
    }
    config.loadCompleted = true;
  }

  function loadFullUserProfile() {
    readObjectFromRemoteDatabaseAndReturnJson(FULL_PROFILE_ENDPOINT, processUserProfileFromStorage);
  }

  function addEventListenersToChat() {
    $$('#agent-send-button').addEventListener('click', clickOnAgentSendButton);
    $$('#maximize').addEventListener('click', maximizeChat);
    $$('#minimize').addEventListener('click', minimizeChat);
    $$('#user-send-button').addEventListener('click', clickOnUserSendButton);
    $$('#clear1').addEventListener('click', clearTranscriptInStorageAndOnScreen);
    $$('#clear2').addEventListener('click', clearTranscriptInStorageAndOnScreen);
  }

  function restoreChatSettingsAndLoadUserProfileFromDatabase() {
    handleMinMaxChat(config.maximized === '1');
    loadFullUserProfile(); // promise with callback
  }

  function readUserConfig() {
    var keys = Object.keys(userConfig);
    keys.forEach(function elementIds(attr) {
      config[attr] = userConfig[attr];
    });
  }

  function renderChatContainer() {
    loadPageSection(config.requestsType,
        'https://rawgit.com/wonakak/js--touchsoft/t03/task-03/denism03/AllChatTemplates.html',
        'div.clientMainContainer',
        function appendChatContainerToPage(result, err) {
          if (err === null || err === undefined) {
            result.classList.add(config.cssClass);
            document.body.appendChild(result);
            config.chat = result;
            addEventListenersToChat();
            restoreChatSettingsAndLoadUserProfileFromDatabase(); // promise callback
          } else {
            throw new Error('Cannot render chat container: ' + err);
          }
        }
    );
  }

  function checkRemoteTranscriptAndUpdateChatView() {
    console.log("update transcript form DB");  // eslint-disable-line no-console
    readObjectFromRemoteDatabaseAndReturnJson(PROFILE_TRANSCRIPT_ENDPOINT, processTranscriptResultFromStorage);
  }

  window.addEventListener('load', function InitializeMegaSuperUsefulChat() {
    readUserConfig();
    renderChatContainer();
    setInterval(checkRemoteTranscriptAndUpdateChatView, 10 * 1000);
    // checkRemoteTranscriptAndUpdateChatView();
  });
};