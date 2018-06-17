window.AgentDashboard = function MegaSuperUsefulChat() {

  var config = {
    dashboard: "not rendered yet",
    users: "not rendered yet",
    chat: "not rendered yet",
    databaseURL: "https://superchat-firebase.firebaseio.com",
    uuid: "unknown",
    userName: "unknown12",
    agentName: "Agent Smith",
    transcriptArray: [],
    msgsCount: 0
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
  // function getAllMessagesEndpoint() {
  //   return config.databaseURL + '/' + dbEndpoints.userMessages + '.json';
  // }
  function getAllUsersEndpoint() {
    return config.databaseURL + '/' + dbEndpoints.userSettings + '.json';
  }

  function getActiveUserMsgEndpoint() {
    return config.databaseURL + '/' + dbEndpoints.userMessages + '/' + config.uuid + '.json';
  }

  function saveObjectToRemoteDatabase(endpoint, obj) {
    fetch(endpoint,
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
    fetch(endpoint,
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

  function appendErrorToTranscriptTree() {
    var tr = document.createElement('tr');
    var transcriptList = config.chat.querySelector('#transcript-list');
    tr.innerHTML = '<td>No messages found!</td>';
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
    tr.innerHTML = '<td class="' + cellClass + '">' + '<span class="' + labelClass + '">['
        + formatDate(record.date) + '_>' + label + ']: </span>' + record.msg + '</td>';
    transcriptList = config.chat.querySelector('#transcript-list');
    transcriptList.appendChild(tr);
    config.msgsCount += 1; // update messages counter
  }

  function clearDashboardFromPreviousUser() {
    var users = config.users.querySelectorAll(".user-info");
    config.chat.querySelector('#transcript-list').innerHTML = "";
    config.userName = "unknown";
    if (users !== undefined && users !== null) {
      users.forEach(function removeHiglight0(user) {
        user.classList.remove("active");
      });
    }

  }

  // populateChatForActiveUser
  function updateDashboardWithActiveUser(transcript) {
    // console.log(transcript);// eslint-disable-line no-console
    if (transcript !== undefined && transcript !== null && transcript.length > 0) {
      config.transcriptArray = transcript;
      transcript.forEach(function addEachMsgToChat0(msg) {
        appendMessageToTranscriptTree(msg);
      });
    } else {
      config.transcriptArray = [];
      appendErrorToTranscriptTree();
    }
  }

  function handleUserChanged(event) {
    var guid;
    var activeUser;
    var endpoint;
    if (event.target.classList.contains("user-info")) { // TODO fix onClick event on <li>
      event.target.classList.add("active");
      guid = event.target.id;
      activeUser = config.dashboard.querySelector('#active-user');
      clearDashboardFromPreviousUser();
      if (guid === undefined || guid === null || guid === "") {
        throw new Error('User UUID is missing for:' + event.target.innerText);
      }
      config.uuid = guid;
      config.userName = event.target.innerText;
      activeUser.innerText = config.userName;
      endpoint = getActiveUserMsgEndpoint();
      console.log("handleUserChanged = " + guid + ", name= " + config.userName + ", read = " + endpoint);// eslint-disable-line no-console
      readObjectFromRemoteDatabase(endpoint, updateDashboardWithActiveUser);
    }
  }

  function handleAgentSendReply() {
    // agent dashboard answer
    var userInput = config.chat.querySelector('#agent-input');
    var msg = userInput.value;
    var record;
    var endpoint;
    console.log("handleAgentSendReply = " + msg);// eslint-disable-line no-console
    if (msg !== '') {
      record = new Record(Date.now(), 'a', msg);
      config.transcriptArray.push(record);
      endpoint = getActiveUserMsgEndpoint();
      console.log("save to = " + endpoint);// eslint-disable-line no-console
      saveObjectToRemoteDatabase(endpoint, config.transcriptArray);
      appendMessageToTranscriptTree(record);
      userInput.value = '';
    }
  }

  function addListenersToDashboardControls() {
    var usersList = config.users.querySelector("#users-list");
    var agentSend = config.chat.querySelector(".agent-send-button");
    console.log(config);// eslint-disable-line no-console
    usersList.addEventListener('click', handleUserChanged);
    agentSend.addEventListener('click', handleAgentSendReply);
  }

  function appendUserToUsersList(user) {
    var listItem;
    var usersList = config.users.querySelector(".users-list");
    listItem = document.createElement('li');
    listItem.classList.add("users-list-item");
    listItem.innerHTML = '<span id="' + user.uuid + '" class="user-info">' + user.name + '</span>';
    usersList.appendChild(listItem);
  }

  function populateUsersLIst(users) {
    var user;
    var keys = Object.keys(users);
    console.log(users);// eslint-disable-line no-console
    keys.forEach(function addEachUserToList0(key) {
      user = users[key];
      appendUserToUsersList(user);
    });
  }

  function loadUsersFromRemoteDatabase() {
    readObjectFromRemoteDatabase(getAllUsersEndpoint(), populateUsersLIst);
  }

  window.addEventListener('load', function InitializeMegaSuperUsefulChat() {
    config.uuid = localStorage.getItem('client-uuid') || "unknown";
    config.dashboard = document.getElementById("dashboard");
    config.users = document.getElementById("dashboard-users");
    config.chat = document.getElementById("dashboard-chat");
    addListenersToDashboardControls();
    loadUsersFromRemoteDatabase();
  });
};