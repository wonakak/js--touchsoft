'use-strict';

var style =
    '.igorbobek-my-chat {' +
    'width: 400px;' +
    'height: max-content;' +
    'border: 1px solid #e4e4e4;' +
    'position: fixed;' +
    'right: 0px;' +
    'bottom: 0px;' +
    'background-color: #000000b3;' +
    'border-radius: 12px;' +
    'padding: 4px;' +
    '}' +
    '.igorbobek-content {' +
    'height: 200px;' +
    'margin-top: 36px;' +
    'width: 100%;' +
    'background: #fff;' +
    'border-radius: 14px;' +
    'text-align: center;' +
    'font-size: 30px;' +
    'overflow-y: auto;' +
    '}' +
    '.igorbobek-minimizer {' +
    'border: none;' +
    'float: right;' +
    'width: 30px;' +
    'height: 30px;' +
    'border-radius: inherit;' +
    'font-family: cursive;' +
    'font-size: larger;' +
    '}' +
    '.igorbobek-mini h4 {' +
    'display: contents;' +
    '}' +
    '.igorbobek-message-box {' +
    'height: 50px;' +
    'width: 70%;' +
    'background: white;' +
    'border-radius: 12px;' +
    'margin-top: 100px;' +
    'bottom: 4px;' +
    'resize: none;' +
    'overflow: auto;' +
    'padding: 8px;' +
    '}' +
    '.igorbobek-send {' +
    'float: right;' +
    'border: none;' +
    'position: absolute;' +
    'bottom: 14px;' +
    'right: 10px;' +
    'border-radius: 6px;' +
    'height: 30px;' +
    'background: #aef5ff;' +
    '}' +
    '.igorbobek-icon-chat {' +
    'margin-top: 23px;' +
    'position: absolute;' +
    'top: -40px;' +
    'height: fit-content;' +
    'left: 38px;' +
    'background: #dddddd;' +
    'border-radius: 11px;' +
    'padding: 7px;' +
    'font-variant: small-caps;' +
    'color: #4c4c4c;' +
    '}' +
    '.igorbobek-message {' +
    'text-align: left;' +
    'font-style: italic;' +
    'font-size: 18px;' +
    'padding: 7px;' +
    'margin-top: 4px;' +
    'background: #b2cdff;' +
    'border-radius: 18px;' +
    '}';

var buttonMinimilizer = null;
var container = null;
var sendButton = null;
var messageBox = null;
var content = null;
var answerDelay = 15;
var checkingDOMReady;


function getCookie(itemName) {
    var i;
    var item;
    var name = `${itemName}=`;
    var decodedCookie = decodeURIComponent(document.cookie);
    var items = decodedCookie.split(';');
    for (i = 0; i < items.length; i += 1) {
        item = items[i];
        item = item.trim();
        if (item.indexOf(name) === 0) {
            return item.substring(name.length, item.length);
        }
    }
    return '';
}

function Message(name, message, time, answered) {
    this.name = name;
    this.message = message;
    this.time = time;
    this.answered = answered || false;
    this.answer(this);
}

Message.prototype.generateDateForBotMessage = function () {
    var dateForBotMessage = new Date(this.time);
    dateForBotMessage.setSeconds(dateForBotMessage.getSeconds() + answerDelay);
    return dateForBotMessage;
};

Message.prototype.secondsLeftForAnswer = function () {
    return new Date().getTime() - this.time.getTime();
};

Message.prototype.answer = function (that) {
    var sendBotMessage = function () {
        var messageBot = new Message(
            'Bot',
            `Ответ на: ${that.message.toUpperCase()}`,
            that.generateDateForBotMessage(),
            true
        );
        messageBot.sendMessage();
        messageBot.saveMessage();
        that.updateMessageInLocalStorage(that.time, true);
        that.setAnswered(true);
    };
    if (!that.answered) {
        setTimeout(sendBotMessage, answerDelay * 1000 - this.secondsLeftForAnswer());
    }
};

Message.prototype.setAnswered = function (answered) {
    this.answered = answered;
}

Message.prototype.updateMessageInLocalStorage = function (searchTime, newAnswered) {
    var i;
    var messageObject;
    var messages = JSON.parse(localStorage.getItem('messages'));
    if (messages !== null) {
        for (i = 0; i < messages.length; i += 1) {
            messageObject = messages[i];
            if (
                new Date(messageObject.time).getTime() ===
                new Date(searchTime).getTime()
            ) {
                messageObject.answered = newAnswered;
            }
        }
        localStorage.removeItem('messages');
        localStorage.setItem('messages', JSON.stringify(messages));
    }
};

Message.prototype.saveMessage = function () {
    var messages = JSON.parse(localStorage.getItem('messages'));
    if (messages === null) {
        messages = [this];
    } else {
        messages.push(this);
    }
    localStorage.setItem('messages', JSON.stringify(messages));
};

Message.prototype.sendMessage = function () {
    var options;
    var messageDiv;
    if (!(this.message === '')) {
        options = {hour: 'numeric', second: 'numeric', minute: 'numeric'};
        messageDiv = document.createElement('div');
        messageDiv.innerHTML = `${this.time.toLocaleString('ru-RU', options)
            } ${
            this.name
            }:<br>${
            this.message}`;
        messageDiv.classList.add('igorbobek-message');
        content.appendChild(messageDiv);
    }
};


function minimizeRecoveryChat() {
    container.hidden =
        getCookie('minimize') !== '' ? getCookie('minimize') === 'true' : true;
    if (container.hidden) {
        buttonMinimilizer.innerHTML = '+';
    } else {
        buttonMinimilizer.innerHTML = '-';
    }
}

function recoveryMessages() {
    var messages = JSON.parse(localStorage.getItem('messages'));
    if (messages !== null) {
        messages.forEach((message) => {
            new Message(
                message.name,
                message.message,
                new Date(message.time),
                message.answered
            ).sendMessage();
        });
    }
}

function minimizeContent() {
    if (container.hidden) {
        buttonMinimilizer.innerHTML = '-';
    } else {
        buttonMinimilizer.innerHTML = '+';
    }
    container.hidden = !container.hidden;
    document.cookie = `minimize=${  container.hidden}`;
}

function initStyle() {
    var styles = document.createElement('style');
    styles.innerHTML = style;
    document.body.appendChild(styles);
}


function listenerSendButton(){
    var message = new Message(
        'You',
        messageBox.value.replace(new RegExp('\\n', 'g'), '<br>'),
        new Date()
    );
    message.sendMessage();
    message.saveMessage();
}

function initListeners() {
    var messagesScrollDown = function () {
        content.scrollTo(0, content.scrollHeight);
    };
    buttonMinimilizer.addEventListener('click',minimizeContent);
    sendButton.addEventListener('click', listenerSendButton);

    content.addEventListener('DOMSubtreeModified', messagesScrollDown);
}

function recovery() {
    minimizeRecoveryChat();
    recoveryMessages();
}


function initChat() {
    var form;
    var mainDiv;
    var iconChat;
    initStyle();

    mainDiv = document.createElement('div');
    mainDiv.classList.add('igorbobek-my-chat');

    iconChat = document.createElement('h3');
    iconChat.innerHTML = 'Chat';
    iconChat.classList.add('igorbobek-icon-chat');
    mainDiv.appendChild(iconChat);
    buttonMinimilizer = document.createElement('button');
    buttonMinimilizer.classList.add('igorbobek-minimizer');
    mainDiv.appendChild(buttonMinimilizer);

    container = document.createElement('div');
    container.classList.add('igorbobek-chat-container');
    mainDiv.appendChild(container);

    content = document.createElement('div');
    content.classList.add('igorbobek-content');
    container.appendChild(content);

    form = document.createElement('form');
    form.setAttribute('onsubmit', 'return false;');
    container.appendChild(form);

    messageBox = document.createElement('textarea');
    messageBox.classList.add('igorbobek-message-box');
    form.appendChild(messageBox);

    sendButton = document.createElement('button');
    sendButton.classList.add('igorbobek-send');
    sendButton.innerHTML = 'Отправить';
    form.appendChild(sendButton);

    document.body.appendChild(mainDiv);
    initListeners();
    recovery();
}


// setInterval и вложенное в него условие решает проблему добавления
// чата на сторонний сайт через консоль, html(head), html(body)
function createChat(){
    if (document.readyState !== 'complete') return;
    clearInterval(checkingDOMReady);
    initChat();
}

checkingDOMReady = setInterval( createChat, 10);

