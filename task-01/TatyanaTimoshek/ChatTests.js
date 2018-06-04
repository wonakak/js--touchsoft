/* global  createStyles, createChat, createMinimizeWindow, setVisibility, init, setHistory, setOnclickFunctions, forMinimizeButton, forMinButton, sendMessage, botAnswer, scrollDown */
/* global QUnit */


function hideChat() {
  var a = document.getElementById('idChatWindow');
  var b = document.getElementById('idMinimizeWindow');
  if (a != null) {
    a.remove();
  }
  if (b != null) {
    b.remove();
  }
}

QUnit.module('Chat creation');

QUnit.test('Check the connection of styles', function(assert) {
  assert.ok(createStyles() !== null, 'The test is successful');
  hideChat();
});

QUnit.test('Check the creation of chat', function(assert) {
  assert.ok(createChat() !== null, 'The test is successful');
  hideChat();
});

QUnit.test('Check the creation of a collapsed chat', function(assert) {
  assert.ok(createMinimizeWindow() !== null, 'The test is successful');
  hideChat();
});

QUnit.test('Check the location of the chat (right).', function(assert) {
  createStyles();
  createChat();
  assert.ok(
    document.getElementById('idChatWindow').getBoundingClientRect().left > 1000,
    'The test is successful'
  );
  hideChat();
});

QUnit.test('Check the visibility of the chat', function(assert) {
  createStyles();
  createChat();
  createMinimizeWindow();
  localStorage.removeItem('visibilityChatWindow');
  localStorage.removeItem('visibilityMinimizeWindow');
  setVisibility();
  assert.ok(
    document.getElementById('idChatWindow').style.visibility === 'visible',
    'The test is successful'
  );
  assert.ok(
    document.getElementById('idMinimizeWindow').style.visibility === 'hidden',
    'The test is successful'
  );
  hideChat();
});

QUnit.module('Operations with local storage');

QUnit.test('Check the work with the history.', function(assert) {
  init();
  localStorage.removeItem('history');
  document.getElementById('idHistoryOfTanyaChat').innerHTML =
    'history Of TanyaChat';
  setHistory();
  assert.ok(
    localStorage.getItem('history') === 'history Of TanyaChat',
    'The test is successful'
  );
  hideChat();
});

QUnit.test('Check the folding of the chat.', function(assert) {
  createStyles();
  createChat();
  createMinimizeWindow();
  localStorage.removeItem('visibilityChatWindow');
  localStorage.removeItem('visibilityMinimizeWindow');
  setVisibility();
  setOnclickFunctions();
  forMinimizeButton();
  assert.ok(
    document.getElementById('idChatWindow').style.visibility === 'hidden',
    'The test is successful'
  );
  assert.ok(
    document.getElementById('idMinimizeWindow').style.visibility === 'visible',
    'The test is successful'
  );
  forMinButton();
  assert.ok(
    document.getElementById('idChatWindow').style.visibility === 'visible',
    'The test is successful'
  );
  assert.ok(
    document.getElementById('idMinimizeWindow').style.visibility === 'hidden',
    'The test is successful'
  );
  hideChat();
});

QUnit.module('Work with messages');

QUnit.test('Check the sending of user messages.', function(assert) {
  var before;
  var after;
  init();
  before = document.getElementById('idHistoryOfTanyaChat').innerHTML.length;
  document.getElementById('idChatInputMessage').innerHTML = 'hello';
  sendMessage();
  after = document.getElementById('idHistoryOfTanyaChat').innerHTML.length;
  assert.ok(before < after, 'The test is successful');
  hideChat();
});

QUnit.test('Check the bot response.', function(assert) {
  init();
  document.getElementById('idStylesTanyaChat').innerHTML = '';
  document.getElementById('idChatInputMessage').innerHTML = 'hello';
  botAnswer();
  assert.ok(
    document
      .getElementById('idHistoryOfTanyaChat')
      .innerHTML.indexOf('HELLO') !== -1,
    'The test is successful'
  );
  hideChat();
});

QUnit.test('Check the format of the user and bot messages.', function(assert) {
  var currentTime = new Date();
  init();
  document.getElementById('idHistoryOfTanyaChat').innerHTML = '';
  document.getElementById('idChatInputMessage').innerHTML = 'hello';
  sendMessage();
  assert.ok(
    document
      .getElementById('idHistoryOfTanyaChat')
      .innerHTML.indexOf(
        currentTime.getHours() +
          ':' +
          currentTime.getMinutes() +
          ' You: ' +
          document.getElementById('idChatInputMessage').innerHTML
      ) !== -1,
    'The test is successful'
  );
  botAnswer();
  assert.ok(
    document
      .getElementById('idHistoryOfTanyaChat')
      .innerHTML.indexOf(
        currentTime.getHours() +
          ':' +
          currentTime.getMinutes() +
          ' Bot: Response to "HELLO"'
      ) !== -1,
    'The test is successful'
  );
  hideChat();
});

QUnit.module('Scrolling');

QUnit.test('Check scrolling the history of messages.', function(assert) {
  var history;
  init();
  history = document.getElementById('idHistoryOfTanyaChat');
  history.innerHTML =
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck' +
    'CheckCheckCheck CheckCheckCheck';
  scrollDown();
  assert.ok(
    history.clientHeight + history.scrollTop === history.scrollHeight,
    'The test is successful'
  );
  hideChat();
});
