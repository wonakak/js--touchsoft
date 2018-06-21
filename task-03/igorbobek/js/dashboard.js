/* global Chat */
/* global User */
/* global apiRefreshToken */
/* global HEADER_URLENCODE */
/* global saveObjectToLocalStorage */
/* global HEADER_JSON */
/* global content */
/* global Message */
/* exported containerForChat */

var containerForChat;
var dashboard;
var chat;
var containerForUsers;
var ChatInstance;
var activeContainer;


function Admin() {
    User.apply(this);
    this.name = 'Admin';
}

Admin.prototype = Object.create(User.prototype);

Admin.prototype.initUser = function initUser(jsonData) {
    this.userId = jsonData.user_id;
    this.accessToken = jsonData.access_token;
    this.refreshToken = jsonData.refresh_token;
    this.tokenId = jsonData.id_token;
    this.isAuthenticated = true;
};

Admin.prototype.init = function init() {
    var that = this;
    var request = chat.makeRequest;

    function refreshToken(token) {
        request(
            apiRefreshToken,
            "POST",
            encodeURI({
                grant_type: "refresh_token",
                refresh_token: token
            }),
            HEADER_URLENCODE
        ).then(function initUser(result) {
            that.initUser(result);
            that.saveToFirebase();
            saveObjectToLocalStorage("user", that);
        });
    }

    (function createUser(callback) {
        request(chat.config.chatUrl +'users/AP9ZReBiPoNSExpqIkFgKl2APd43.json', "GET", undefined, HEADER_JSON)
            .then(function f(data) {
            callback.call(this, data.refreshToken);
        });
    })(refreshToken);
};


function AdminChat() {
    Chat.apply(this);
    this.user = new Admin();
    this.sendTo = undefined;
}

ChatInstance = (function fun() {
    var instance;

    function createInstance() {
        return new AdminChat();
    }

    return {
        getInstance: function f() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

AdminChat.prototype = Object.create(Chat.prototype);

AdminChat.prototype.getMessagesByChatUID = function getMessagesByChatUID(uid){
    return chat.makeRequest(
        this.config.chatUrl +
        "chatMessages/" + uid +
        ".json?" +
        "&auth=" +
        this.user.tokenId,
        "GET",
        undefined,
        HEADER_JSON
    );
};

AdminChat.prototype.clearContent = function clearContent() {
    content.innerHTML = '';
};

AdminChat.prototype.initChatByUID = function initChatByUID(uid) {
    this.showMessagesByChatUID(uid);
    this.sendTo = uid;
    this.setTitle(dashboard.chats[uid].name);
};

AdminChat.prototype.sortMessages = function sortMessages(data) {
        var result;

        if (data === null){
            result = undefined;
        }else{
            result = chat.clearContent();
            return Object.keys(data)
                .map(function returnValue(value){
                    return data[value];
                })
                .sort(function compare(a, b) {
                    var first = a.time;
                    var second = b.time;
                    var comp;

                    if( first > second){
                        comp = 1;
                    }else if(second < first){
                        comp = -1;
                    }else{
                        comp = 0;
                    }

                    return comp;
                });
        }

        return result;
};


AdminChat.prototype.showMessagesByChatUID = function showMessagesByChatUID(uid){
    var message;
    this.getMessagesByChatUID(uid)
        .then(function showMessages(data){
            chat.clearContent();
            chat.sortMessages(data).forEach(function showMessage(value) {
                message = new Message(value.name, value.message, value.time, value.answered);
                message.sendMessage();
            });
        });
};

AdminChat.prototype.update = function update() {
    if(this.sendTo) {
        this.showMessagesByChatUID(this.sendTo);
    }
};

Message.prototype.saveMessage = function saveMessage() {
    chat.makeRequest(
        chat.config.chatUrl +
        "/chatMessages/" +
        chat.sendTo +
        ".json?auth=" +
        chat.user.tokenId,
        "POST",
        JSON.stringify(this),
        HEADER_JSON
    );
};


Message.prototype.answer = function answer() {};


function Dashboard(){
    this.chats = {};
    this.sort = 'name';
    this.match = "";

    (function f(that) {
       setInterval(function updateDashboard() {
           that.update();
       }, 30000);
    })(this);

}

Dashboard.prototype.update = function update() {
    this.initUserChatsList();
    ChatInstance.getInstance().update();
};


Dashboard.prototype.initListeners = function initListeners() {
    var sortElement = document.getElementById('sort');
    var filter = document.getElementById('filter');
    var buttonClose = document.getElementById('button-close-dashboard');

    buttonClose.addEventListener('click', function hideMainContainer() {
        activeContainer.removeAttribute('class');
        activeContainer.classList.add('hide');
    });


    function getValueForSort(value){
        switch (value) {
            case '1': return 'name';
            case '2': return 'online';
            default: return undefined;
        }
    }

    sortElement.addEventListener('change', function sortUsers(event) {
        dashboard.sort = getValueForSort(event.target.value);
        dashboard.showUsers();
    });

    filter.addEventListener('input', function filterUsers() {
        dashboard.match = this.value;
        dashboard.showUsers();
    });

};

Dashboard.prototype.getUsers = function getUsers() {
    return chat.makeRequest(
        chat.config.chatUrl +
        'users/.json?',
        'GET',
        undefined,
        HEADER_JSON
    );
};

Dashboard.prototype.initUserChatsList = function initUserChatsList() {
    return this.getUsers()
        .then(function initChats(data){
            var promises = [];
            Object.keys(data).forEach(
                    function getChatsFromFirebase(value) {
                        promises.push(chat.makeRequest(
                            chat.config.chatUrl + 'userChat/' + value +'.json',
                            'GET',
                            undefined,
                            HEADER_JSON
                        ).then(function initData(result) {
                            var myReturn;
                            if(result) {
                                myReturn = dashboard.setUserStatus(result[0])
                                    .then(function updateData(isOnline) {
                                        data[value].online = isOnline;
                                        dashboard.chats[result[0]] = data[value];
                                    });
                            }
                            return myReturn;
                        }));
                    });
            Promise.all(promises)
                .then(function showUsers() {
                    dashboard.showUsers();
            });
            return true;
        });
};

Dashboard.prototype.checkUserStatus = function checkUserStatus(chatUID) {
    return chat.makeRequest(
        chat.config.chatUrl +
        "/chats/" +
        chatUID +
        ".json?",
        "GET",
        undefined,
        HEADER_JSON
    ).then(function calcTime(result) {
        return ((new Date()).getTime() - result.lastMessageTime) < 30000;
    });
};

Dashboard.prototype.initChatForDashboard = function initChatForDashboard() {
    ChatInstance.getInstance().initConfig(
            {"title":"Admin",
                "botName":"Bot",
                "chatUrl":"https://chatjs-28d0b.firebaseio.com/",
                "cssClass":"igorbobek-my-chat",
                "position":"right",
                "allowMinimize":false,
                "requireName":false,
                "allowDrag":false,
                "showDateTime":true,
                "requests":"xhr"}
    );
    chat = ChatInstance.getInstance();
    chat.init();
};

Dashboard.prototype.appendUserToListContent = function appendUserToList(chatUID) {
    var newLi = document.createElement('li');
    newLi.innerText = dashboard.chats[chatUID].name;
    newLi.setAttribute('value', chatUID);

    newLi.addEventListener('click', function showChat() {
        activeContainer.removeAttribute('class');
        activeContainer.classList.add('show');
        chat.initChatByUID(this.getAttribute('value'))
    });

    if(dashboard.chats[chatUID].online){
        newLi.style.background = 'green';
    }
    containerForUsers.appendChild(newLi);
};

Dashboard.prototype.clearUserListContainer = function clearUserList() {
    containerForUsers.innerHTML = '';
};

Dashboard.prototype.setUserStatus = function setUserStatus(chatUID) {
    return dashboard.checkUserStatus(chatUID);
};

Dashboard.prototype.showUsers = function showUsers(){
    dashboard.clearUserListContainer();
    this.getfilteredAndSortedUsers().forEach(function appendUserToList(chatUID) {
        dashboard.appendUserToListContent(chatUID);
    });

};

Dashboard.prototype.getfilteredAndSortedUsers = function filterAndSort() {
      return this.filterUsers(this.sortUser(dashboard.chats));
};

Dashboard.prototype.filterUsers = function filterUsers(data) {
    return data
        .filter(function filter(value) {
            if(dashboard.match === ''){
                return true;
            } else if(value[Object.keys(value)[0]].name.search('^' + dashboard.match) === 0){
                return true;
            }

            return false;
        })
        .map(function map(obj) {
            return Object.keys(obj)[0];
        });
};

Dashboard.prototype.sortUser = function sortUser() {
    return Object.keys(dashboard.chats)
        .map(function map(key) {
            var obj = {};
            obj[key] = dashboard.chats[key];
            return obj;
        })
        .sort(function sort(a, b) {
            var first = a[Object.keys(a)[0]][dashboard.sort];
            var second = b[Object.keys(b)[0]][dashboard.sort];
            var result;

            if (typeof(first) === 'boolean'){

                first = !first;
                second = !second;
            }
            if( first > second){
              result = 1;
            }else if(second > first){
              result = -1;
            }else{
              result = 0;
            }
            return result;
        });
};

document.addEventListener('DOMContentLoaded', function creatingDashboard() {
    containerForChat = document.getElementById('chat');
    containerForUsers = document.getElementById('user-list');
    activeContainer = document.getElementById('active-container');
    dashboard = new Dashboard();
    dashboard.initListeners();
    dashboard.initChatForDashboard();
    dashboard.initUserChatsList();
});