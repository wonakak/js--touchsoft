/* global QUnit */
/* global window */
var pathToDB = "https://besomhead-chat.firebaseio.com/";
var defaultConfig = {
  chatTitle: "Чат",
  botName: "Бот",
  cssClass: "chat-container",
  position: "right",
  allowMinimize: "true",
  allowDrag: "false",
  requireName: "true",
  showDateTime: "true",
  requests: "fetch"
};

QUnit.module("Test initial LS configuration", {
  before() {
    localStorage.clear();
    window.setUniqueUserID();
  }
});
QUnit.test("should generate new unique user name", function test(assert) {
  assert.notEqual(localStorage.getItem("chat-user-id"), null);
});
QUnit.test("should generate user name in proper format", function test(assert) {
  assert.ok(localStorage.getItem("chat-user-id").match(/user\d{13}/));
});

QUnit.module("Test config applying");
QUnit.test("should set proper chat title", function test(assert) {
  assert.equal(
    document.getElementById("chat").getElementsByTagName("legend")[0].innerHTML,
    defaultConfig.chatTitle
  );
});
QUnit.test("should set proper bot name", function test(assert) {
  assert.equal(window.config.botName, defaultConfig.botName);
});
QUnit.test("should set proper chat URL", function test(assert) {
  assert.equal(window.config.chatURL, pathToDB);
});
QUnit.test("should set proper CSS class", function test(assert) {
  assert.ok(
    document.getElementById("chat").classList.contains(defaultConfig.cssClass)
  );
});
QUnit.test("should set proper chat position", function test(assert) {
  assert.ok(
    document
      .getElementById("chat")
      .classList.contains("chat-container-".concat(defaultConfig.position))
  );
});
QUnit.test("should set minimization rules", function test(assert) {
  assert.ok(
    document.getElementById("chat-toggle-button") &&
      JSON.parse(defaultConfig.allowMinimize)
  );
});
QUnit.test("should set drag rules", function test(assert) {
  assert.equal(
    document
      .getElementById("chat")
      .classList.contains("chat-toggle-button-container-drag"),
    JSON.parse(defaultConfig.allowDrag)
  );
});
QUnit.test("should set proper name requirements", function test(assert) {
  var doneExpand;
  var done;
  doneExpand = assert.async();
  setTimeout(function waitAndExpandChat() {
    window.expandChat();
    doneExpand();
  }, 3000);

  done = assert.async();
  setTimeout(function asyncAssertion() {
    assert.equal(
      document.getElementById("chat-username-prompt-container") !== null,
      JSON.parse(defaultConfig.requireName)
    );
    if (document.getElementById("chat-toggle-button") !== null) {
      assert.equal(
        document.getElementById("chat-toggle-button").disabled,
        JSON.parse(defaultConfig.requireName)
      );
    }
    assert.equal(
      document.getElementById("chat-input-txt").disabled,
      JSON.parse(defaultConfig.requireName)
    );
    assert.equal(
      document.getElementById("chat-message-button").disabled,
      JSON.parse(defaultConfig.requireName)
    );
    done();
  }, 5000);
});

QUnit.module("Test user name prompt");
QUnit.test("should save user name to DB", function test(assert) {
  var doneExpand;
  var donePost;
  var event = new Event("click");
  doneExpand = assert.async();
  setTimeout(function onDoneExpand() {
    window.expandChat();
    doneExpand();
  }, 3000);
  if (document.getElementById("chat-username-prompt-container") === null) {
    window.askUserName();
  }
  document.getElementById("chat-username-prompt-input").value = "Test user";
  document.getElementById("chat-username-prompt-button").dispatchEvent(event);
  donePost = assert.async();
  setTimeout(function onDonePost() {
    window
      .sendRequestToStorage("userName", "GET", "")
      .then(function onUserNameLoad(data) {
        assert.equal(data, "Test user");
        donePost();
      });
  }, 5000);
});

QUnit.module("Test toggle button");
QUnit.test("should change chat style", function test(assert) {
  var prevChatStyle = document.getElementById("chat").classList[2];
  var event = new Event("click");
  var done;
  document.getElementById("chat-toggle-button").dispatchEvent(event);
  done = assert.async();
  setTimeout(function asyncAssertion() {
    assert.notEqual(
      document.getElementById("chat").classList[2],
      prevChatStyle
    );
    done();
  }, 2000);
});
QUnit.test("should save changed chat state to DB", function test(assert) {
  var doneGetPrev;
  var doneGetCur;
  var event = new Event("click");
  doneGetPrev = assert.async();
  setTimeout(function onGetPrevDone() {
    window
      .sendRequestToStorage("chatState", "GET", "")
      .then(function onGetPrevState(data) {
        defaultConfig.chatState = data;
        doneGetPrev();
      });
  }, 2000);
  document.getElementById("chat-toggle-button").dispatchEvent(event);
  doneGetCur = assert.async();
  setTimeout(function onGetCurDone() {
    window
      .sendRequestToStorage("chatState", "GET", "")
      .then(function onGetCurState(data) {
        assert.notEqual(data, defaultConfig.chatState);
        doneGetCur();
      });
  }, 2000);
});

QUnit.module("Test connections");
QUnit.test("should send requests by fetch", function test(assert) {
  var done = assert.async();
  window
    .sendRequestToStorageByFetch(
      "messages",
      "POST",
      new window.Message(new Date(), "Test user:", "Test message")
    )
    .then(function onPostDone() {
      window
        .sendRequestToStorageByFetch("messages", "GET", "")
        .then(function onGetDone(data) {
          assert.notEqual(data, null);
          done();
        });
    });
});
QUnit.test("should send requests by XHR", function test(assert) {
  var done = assert.async();
  window
    .sendRequestToStorageByXHR(
      "messages",
      "POST",
      new window.Message(new Date(), "Test user:", "Test message")
    )
    .then(function onPostDone() {
      window
        .sendRequestToStorageByXHR("messages", "GET", "")
        .then(function onGetDone(data) {
          assert.notEqual(data, null);
          done();
        });
    });
});
