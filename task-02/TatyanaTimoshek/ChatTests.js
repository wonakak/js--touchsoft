/* global  config, createStyles, createChat, createMinimizeWindow, setVisibility,
init, forMinButton, sendMessage, botAnswer, findId, scrollDown */
/* global QUnit */

function hideChat() {
  var a = document.getElementById('idChatWindow');
  var b = document.getElementById('idMinimizeWindow');
  var c = document.getElementById('idInputNameField');
  var d = document.getElementById('idHideHistoryPane');
  var e = document.getElementById('idEnterName');
  if (a != null) a.remove();
  if (b != null) b.remove();
  if (c != null) c.remove();
  if (d != null) d.remove();
  if (e != null) e.remove();
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
  if (config.position === 'right')
    assert.ok(
      document.getElementById('idChatWindow').getBoundingClientRect().left >
        1000,
      'The test is successful'
    );
  if (config.position === 'left')
    assert.ok(
      document.getElementById('idChatWindow').getBoundingClientRect().left <
        1000,
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

QUnit.test('Check the work with id generation.', function(assert) {
  var newId;
  var id = localStorage.getItem('idForTanyaChat');
  localStorage.removeItem('idForTanyaChat');
  newId = findId();
  assert.ok(
    newId !== null &&
      newId !== id &&
      newId === localStorage.getItem('idForTanyaChat'),
    'The test is successful'
  );
  localStorage.removeItem('idForTanyaChat');
  localStorage.setItem('idForTanyaChat', id);
  hideChat();
});

QUnit.module('Operations with FireBase');

QUnit.test('Check the folding of the chat.', function(assert) {
  createStyles();
  createChat();
  createMinimizeWindow();
  setVisibility();
  forMinButton();
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
  var done;
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
      ) !== false,
    'The test is successful'
  );
  botAnswer();
  done = assert.async();
  setTimeout(function() {
    assert.ok(
      document
        .getElementById('idHistoryOfTanyaChat')
        .innerHTML.indexOf(
          currentTime.getHours() +
            ':' +
            currentTime.getMinutes() +
            '  ' +
            config.botName +
            ': Response to "HELLO"'
        ) !== false,
      'The test is successful'
    );
    hideChat();

    done();
  }, 1000);
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
