var initChat;
var isUser = function isUser0(record) {
    return record.src === 'u';
};
var Record = function Record(date, src, msg) {
    this.date = date;
    this.src = src;
    this.msg = msg;
};

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
        label = 'USER';
    } else {
        rowClass = 'tr-agent';
        cellClass = 'td-agent';
        labelClass = 'agent-label';
        label = 'AGENT';
    }

    tr = document.createElement('tr');
    tr.classList.add(rowClass);
    tr.innerHTML = '<td class="' + cellClass + '"><span class="' + labelClass + '">['
        + formatDate(record.date) + ' ' + label + ']: </span>' + record.msg + '</td>';
    transcriptList = document.getElementById('transcript-list');
    transcriptList.appendChild(tr);
}

function getTranscriptArrayFromStorage() {
    var item = localStorage.getItem('transcript');
    return (item !== null && item.length !== 0) ? JSON.parse(item) : [];
}

function saveMessageToStorage(record) {
    var transcriptArray = getTranscriptArrayFromStorage();
    transcriptArray.push(record);
    localStorage.setItem('transcript', JSON.stringify(transcriptArray));
}

function autoAnswerFromAgent(record) {
    var autoAnswer = new Record(null, 'a', 'Ответ на "' + record.msg.toUpperCase() + '"');
    setTimeout(function agentAutoAnswer() {
        autoAnswer.date = Date.now();
        saveMessageToStorage(autoAnswer);
        appendMessageToTranscriptTree(autoAnswer);
    }, 15000);
}

function addedClientMessageToTranscript(record) {
    autoAnswerFromAgent(record);
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
    var userInput = document.getElementById('user-input');
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
    var minChat = document.getElementById('min-chat');
    var maxChat = document.getElementById('popup-chat');
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
    var transcriptList = document.getElementById('transcript-list');
    transcriptList.innerHTML = "";
    localStorage.removeItem('transcript');
}

function loadAllTranscriptFromStorage() {
    var transcriptList = getTranscriptArrayFromStorage();
    var index;
    for (index = 0; index < transcriptList.length; index += 1) {
        appendMessageToTranscriptTree(transcriptList[index]);
    }
}

function renderChatContainer() {
    var mainContainer = document.createElement('div');
    mainContainer.classList.add('mainContainer');
    mainContainer.innerHTML = '<div class="box"><div id="min-chat" class="min-chat "><div class="header"><span id="clear1" class="clear">Clear</span><span>Our chat logo</span><svg id="maximize" width="18" height="12"><path d="M17.76,8.63,11.57,2.44a.49.49,0,0,0-.11-.18L9.34.14A.52.52,0,0,0,9,0a.49.49,0,0,0-.38.14L6.44,2.26a.67.67,0,0,0-.11.18L.15,8.63a.48.48,0,0,0,0,.7l2.12,2.12a.48.48,0,0,0,.7,0l6-6,6,6a.5.5,0,0,0,.71,0l2.12-2.12A.5.5,0,0,0,17.76,8.63Z"></path></svg></div></div><div id="popup-chat" class="popup-chat hidden-chat"><div class="header"><span id="clear2" class="clear">Clear</span><span>Our chat logo</span><svg id="minimize" width="18" height="12"><path d="M17.76,8.63,11.57,2.44a.49.49,0,0,0-.11-.18L9.34.14A.52.52,0,0,0,9,0a.49.49,0,0,0-.38.14L6.44,2.26a.67.67,0,0,0-.11.18L.15,8.63a.48.48,0,0,0,0,.7l2.12,2.12a.48.48,0,0,0,.7,0l6-6,6,6a.5.5,0,0,0,.71,0l2.12-2.12A.5.5,0,0,0,17.76,8.63Z"></path></svg></div><div class="chatArea"><div class="transcript-area"><table id="transcript-list" class="transcript-list"></table></div></div><div class="footer"><table class="commands-area"><tr><td><textarea name="user-input" id="user-input" cols="40" rows="2" class="user-input"></textarea></td><td class="send-button-container"><div id="user-send-button" class="user-send-button">Send</div><td><div id="agent-send-button" class="agent-send-button">A</div></td></td></tr></table><div></div></div></div></div>';
    document.body.appendChild(mainContainer);
}

function addEventListenersToChat() {
    var sendButton = document.getElementById('user-send-button');
    var agentSend = document.getElementById('agent-send-button');
    var maximize = document.getElementById('maximize');
    var minimize = document.getElementById('minimize');

    sendButton.addEventListener('click', clickOnUserSendButton);
    agentSend.addEventListener('click', clickOnAgentSendButton);
    maximize.addEventListener('click', maximizeChat);
    minimize.addEventListener('click', minimizeChat);
    document.getElementById('clear1').addEventListener('click', clearTranscriptInStorageAndOnScreen);
    document.getElementById('clear2').addEventListener('click', clearTranscriptInStorageAndOnScreen);
}

function restoreChatSettingsAndTranscript() {
    var maximized = localStorage.getItem('maximized') || '0';
    handleMinMaxChat(maximized === '1');
    loadAllTranscriptFromStorage();
}

initChat = function initChat0() {
    renderChatContainer();
    addEventListenersToChat();
    restoreChatSettingsAndTranscript();
    return "chat is created"
};
// initialize and render chat on the page
window.addEventListener('load', initChat);
