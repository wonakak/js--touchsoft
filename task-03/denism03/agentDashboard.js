window.AgentDashboard = function MegaSuperUsefulAgentDashboard() {
  var sortFilter = {
    lastactive: "lastactive",
    online: "online",
    all: "all",
    name: "name"
  };
  var config = {
    dashboardEl: "not rendered yet",
    usersEl: "not rendered yet",
    chatEl: "not rendered yet",
    databaseURL: "https://superchat-firebase.firebaseio.com",
    uuid: "unknown",
    userName: "unknown12",
    agentName: "Agent Smith",
    transcriptArray: [],
    users: [],
    clientSelected: false,
    requestsType: "fetch",
    activeTime: 30 * 1000, // 30 sec
    userStats: null,
    agentStats: null
  };
  var dbEndpoints = {
    userSettings: "settings",
    userMessages: "messages",
    userProfile: "profile",
    userStatistics: "statistics",
    dashboardEl: "dashboard"
  };
  var ALL_SETTINGS_ENDPOINT = dbEndpoints.userSettings + '.json';
  var ALL_STATISTICS_ENDPOINT = dbEndpoints.userStatistics + '.json';
  var DASHBOARD_STATISTICS_ENDPOINT = dbEndpoints.dashboardEl + '.json';

  var UserStatMsgs = function UserStatMsgs0(msgsCount) {
    this.msgsCount = msgsCount;
  };

  var getAgentSeenMessagesEndpoint = function () {
    return dbEndpoints.dashboardEl + '/' + config.uuid + '.json';
  };

  var getProfileTranscriptEndpoint = function () {
    return dbEndpoints.userProfile + '/' + config.uuid + '/' + dbEndpoints.userMessages + '.json';
  };

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

  function pushMsgToUserProfile(record) {
    var replaceWholeObjectEndpoint = config.databaseURL + '/' + getProfileTranscriptEndpoint();
    if (config.requestsType === "fetch") {
      executeFetchRequest(replaceWholeObjectEndpoint,
          'POST', dbHeaders, JSON.stringify(record), "text", false, defaultErrorHandler, null)
    } else {
      executeXhrRequest(replaceWholeObjectEndpoint,
          'POST', dbHeaders, JSON.stringify(record), "text", false, defaultErrorHandler, null);
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

  function appendNoMessagesFoundErrorToTranscriptTree() {
    var tr = document.createElement('tr');
    var transcriptList = config.chatEl.querySelector('#transcript-list');
    tr.innerHTML = '<td class="transcript-list-td">No messages found!</td>';
    transcriptList.appendChild(tr);
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
      label = config.agentName;
    }
    tr = document.createElement('tr');
    tr.classList.add(rowClass);
    tr.innerHTML = '<td class="transcript-list-td ' + cellClass + '">'
        + '<span class="' + labelClass + '">[' + formatDate(record.date) + '_>' + label + ']: </span>'
        + '<br>' + record.msg
        + '</td>';
    transcriptList = config.chatEl.querySelector('#transcript-list');
    transcriptList.appendChild(tr);
    config.msgsCount += 1; // update messages counter
  }

  function clearDashboardFromPreviousUser() {
    var users = config.usersEl.querySelectorAll(".users-list-item");
    if (users !== undefined && users !== null) {
      users.forEach(function removeHighlight0(user) {
        user.classList.remove("active");
      });
    }
    config.chatEl.querySelector('#transcript-list').innerHTML = "";
    config.userName = "unknown";
    config.transcriptArray = [];
    config.clientSelected = false;
    config.userStats = null;
    config.agetStats = null;
  }

  function processTranscriptResultFromStorage(transcriptJson) {
    var transcriptList = (transcriptJson !== null && transcriptJson !== undefined) ? Object.values(transcriptJson) : [];
    var index;
    var msg;
    // TODO possibly sort() for transcriptList is required
    if (transcriptList.length === 0) {
      appendNoMessagesFoundErrorToTranscriptTree();
      return;
    }
    if (transcriptList.length > config.transcriptArray.length) {
      // saveObjectToRemoteDatabase(POFILE_MSGS_COUNT_ENDPOINT, new UserStatMsgs(transcriptList.length));
      for (index = config.transcriptArray.length; index < transcriptList.length; index += 1) {
        msg = transcriptList[index];
        appendMessageToTranscriptTree(msg);
        config.transcriptArray.push(msg);
      }
    }
    // reset Unread status
    document.getElementById(config.uuid).querySelector(".uunread").classList.remove("blue");
    // save agent seen messages
    saveObjectToRemoteDatabase(getAgentSeenMessagesEndpoint(), new UserStatMsgs(config.transcriptArray.length));
  }

  function handleUserChanged(event) {
    var guid;
    var activeUser;
    var element;
    // console.log(event); // eslint-disable-line no-console
    if (event.currentTarget.classList.contains("users-list-item")) { // TODO fix onClick event on <li>
      element = event.currentTarget;
      config.clientSelected = true;
      clearDashboardFromPreviousUser();
      element.classList.add("active");
      guid = element.id;
      activeUser = config.dashboardEl.querySelector('#active-user');
      if (guid === undefined || guid === null || guid === "") {
        throw new Error('User UUID is missing for:' + element);
      }
      config.uuid = guid;
      config.userName = element.querySelector(".user-info").innerText;
      activeUser.innerText = config.userName;
      config.clientSelected = true;
      // console.log("handleUserChanged = " + guid + ", name= " + config.userName);// eslint-disable-line no-console
      readObjectFromRemoteDatabaseAndReturnJson(getProfileTranscriptEndpoint(), processTranscriptResultFromStorage);
    }
  }

  function handleAgentSendReply() {
    // agent dashboard answer
    var userInput = config.chatEl.querySelector('#agent-input');
    var msg = userInput.value;
    var record;
    // console.log("handleAgentSendReply = " + msg);// eslint-disable-line no-console
    if (msg !== '') {
      record = new Record(Date.now(), 'a', msg);
      config.transcriptArray.push(record);
      pushMsgToUserProfile(record);
      appendMessageToTranscriptTree(record);
      userInput.value = '';
    }
  }

  function appendUserToUsersList(user) {
    var listItem;
    var usersList = config.usersEl.querySelector("#users-list");
    listItem = document.createElement('li');
    listItem.setAttribute("id", user.uuid);
    listItem.classList.add("users-list-item");
    listItem.classList.add("dashboard-users-li");
    listItem.addEventListener('click', handleUserChanged);
    // id="' + user.uuid + '"
    listItem.innerHTML = '<span class="user-info">' + user.name + '</span><span class="uactive dot red"></span><span class="uunread dot blue"></span>';
    usersList.appendChild(listItem);
  }

  function updateAgentUnreadStatus(guid, agentSeen) {
    var listItem;
    var userStat;
    var uunread;
    // console.log("Unread>> " + guid + " >> " + agentSeen);// eslint-disable-line no-console
    if (config.userStats !== null && guid !== undefined && guid !== null && agentSeen !== undefined && agentSeen !== null) {
      listItem = document.getElementById(guid);
      userStat = config.userStats[guid];
      if (listItem !== undefined && listItem !== null && userStat !== undefined && userStat !== null) {
        uunread = listItem.querySelector(".uunread");
        if (agentSeen < userStat.msgs.msgsCount) {
          uunread.classList.add("blue");
        } else {
          uunread.classList.remove("blue");
        }
      }
    }
  }

  function updateAgentUnreadStatistics(msgsAgentSeen) {
    var agentSeen;
    var keys;
    if (msgsAgentSeen !== undefined && msgsAgentSeen !== null) {
      keys = Object.keys(msgsAgentSeen);
      keys.forEach(function addEachUserToList0(key) {
        agentSeen = msgsAgentSeen[key];
        updateAgentUnreadStatus(key, agentSeen.msgsCount);
      });
    } else {
      // initialize agent has seen no messages
      keys = Object.keys(config.userStats);
      keys.forEach(function addEachUserToList0(key) {
        config.uuid = key;
        saveObjectToRemoteDatabase(getAgentSeenMessagesEndpoint(), new UserStatMsgs(0));
      });
      config.uuid = "unknown";
    }
  }

  function updateUserActiveStatistics(usersStats) {
    var stat;
    var keys;
    var listItem;
    var uactive;
    var lastSeen;
    // var msgsCount;
    var timeDiff;
    if (usersStats !== undefined && usersStats !== null) {
      keys = Object.keys(usersStats);
      keys.forEach(function updateStatisticsForEachUser0(guid) {
        stat = usersStats[guid];
        lastSeen = stat.active.lastSeen;
        // msgsCount = stat.msgs.msgsCount;
        // console.log("Active>> " + guid + " >> " + JSON.stringify(stat));// eslint-disable-line no-console
        listItem = document.getElementById(guid);
        if (listItem !== undefined && listItem !== null) {
          uactive = listItem.querySelector(".uactive");
          timeDiff = Date.now() - lastSeen;
          config.users[guid].lastSeen = lastSeen;
          if (timeDiff < config.activeTime) {
            uactive.classList.add("green");
            uactive.classList.remove("red");
            config.users[guid].active = true;
          } else {
            uactive.classList.add("red");
            uactive.classList.remove("green");
            config.users[guid].active = false;
          }
          // console.log("msgsCount=" + msgsCount);// eslint-disable-line no-console
        }
      });
      // update agent seen messages
      config.userStats = usersStats;
      readObjectFromRemoteDatabaseAndReturnJson(DASHBOARD_STATISTICS_ENDPOINT, updateAgentUnreadStatistics);
    }
  }

  function populateUsersLIst(users) {
    var user;
    var keys;
    if (users !== undefined && users !== null) {
      config.users = users;
      keys = Object.keys(users);
      // console.log(users);// eslint-disable-line no-console
      keys.forEach(function addEachUserToList0(key) {
        user = users[key];
        appendUserToUsersList(user);
      });
      readObjectFromRemoteDatabaseAndReturnJson(ALL_STATISTICS_ENDPOINT, updateUserActiveStatistics);
    }
  }

  function loadUsersFromRemoteDatabase() {
    readObjectFromRemoteDatabaseAndReturnJson(ALL_SETTINGS_ENDPOINT, populateUsersLIst);
  }

  function syncTranscript() {
    if (config.clientSelected) {
      readObjectFromRemoteDatabaseAndReturnJson(getProfileTranscriptEndpoint(), processTranscriptResultFromStorage);
    }
  }

  function syncStatistics() {
    readObjectFromRemoteDatabaseAndReturnJson(ALL_STATISTICS_ENDPOINT, updateUserActiveStatistics);
  }

  function compareByLastSeen(a, b) {
    if (a.lastSeen < b.lastSeen) {
      return 1;
    }
    if (a.lastSeen > b.lastSeen) {
      return -1;
    }
    return 0;
  }

  function compareByName(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  function handleUsersSortedOrFiltered(event) {
    var value = config.usersEl.querySelector("#users-sort").value;
    var usersList = config.usersEl.querySelector("#users-list");
    var orderedList = [];
    var keys;
    var user;
    console.log(event); // eslint-disable-line no-console
    console.log(value); // eslint-disable-line no-console
    if (config.users !== undefined && config.users !== null) {
        keys = Object.keys(config.users);
      if (value === sortFilter.all) {
        usersList.innerHTML = "";
        keys.forEach(function addUser1toList0(key) {
          user = config.users[key];
          appendUserToUsersList(user);
        });
      } else if (value === sortFilter.online) {
        usersList.innerHTML = "";
        keys.forEach(function addUser2toList0(key) {
          user = config.users[key];
          if (user.active) {
            appendUserToUsersList(user);
          }
        });
      } else if (value === sortFilter.name) {
        usersList.innerHTML = "";
        keys.forEach(function addUser3toList0(key) {
          user = config.users[key];
          orderedList.push(user);
        });
        orderedList.sort(compareByName);
        orderedList.forEach(function addUser4toList0(u) {
          appendUserToUsersList(u);
        });
      } else if (value === sortFilter.lastactive) {
        usersList.innerHTML = "";
        keys.forEach(function addUser5toList0(key) {
          user = config.users[key];
          orderedList.push(user);
        });
        orderedList.sort(compareByLastSeen);
        orderedList.forEach(function addUser6toList0(u) {
          appendUserToUsersList(u);
        });
      }
    }
  }

  function addListenersToDashboardControls() {
    // var usersList = config.users.querySelector("#users-list");
    var agentSend = config.chatEl.querySelector(".agent-send-button");
    var usersSort = config.usersEl.querySelector("#users-sort");
    // console.log(config);// eslint-disable-line no-console
    // usersList.addEventListener('click', handleUserChanged);
    agentSend.addEventListener('click', handleAgentSendReply);
    usersSort.addEventListener('change', handleUsersSortedOrFiltered);
  }

  window.addEventListener('load', function InitializeMegaSuperUsefulChat() {
    config.uuid = localStorage.getItem('client-uuid') || "unknown";
    config.dashboardEl = document.getElementById("dashboard");
    config.usersEl = document.getElementById("dashboard-users");
    config.chatEl = document.getElementById("dashboard-chat");
    addListenersToDashboardControls();
    loadUsersFromRemoteDatabase();
    setInterval(syncTranscript, 10 * 1000);
    setInterval(syncStatistics, 10 * 1000);
  });
};