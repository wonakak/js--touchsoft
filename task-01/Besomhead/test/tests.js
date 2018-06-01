/* global QUnit */
/* global window */

if (sessionStorage.getItem("reload-tested") === null) {
  sessionStorage.setItem("reload-tested", "false");
}

QUnit.module("Test initial chat state", {
  before() {
    localStorage.clear();
    document.body.removeChild(document.getElementById("chat"));
    window.createChatMarkup();
  }
});
QUnit.test("should be collapsed at the first time", function test(assert) {
  assert.equal(localStorage.getItem("chat"), "chat-collapsed");
});
QUnit.test("should have collapsed CSS-class", function test(assert) {
  assert.ok(
    document.getElementById("chat").classList.contains("chat-collapsed")
  );
});

QUnit.module("Test configuration remaining", {
  before() {
    if (sessionStorage.getItem("reload-tested") === "false") {
      sessionStorage.setItem("prev-chat-state", localStorage.getItem("chat"));
      sessionStorage.setItem(
        "prev-chat-style",
        document.getElementById("chat").classList[1]
      );
      sessionStorage.setItem(
        "prev-chat-messages",
        localStorage.getItem("chat-messages")
      );
      window.location.reload(true);
    }
  },
  after() {
    sessionStorage.setItem("reload-tested", "true");
  }
});
QUnit.test("should save chat state", function test(assert) {
  assert.equal(
    localStorage.getItem("chat"),
    sessionStorage.getItem("prev-chat-state")
  );
});
QUnit.test("should save chat style", function test(assert) {
  assert.equal(
    document.getElementById("chat").classList[1],
    sessionStorage.getItem("prev-chat-style")
  );
});
QUnit.test("should save messages", function test(assert) {
  assert.deepEqual(
    JSON.parse(localStorage.getItem("chat-messages")),
    JSON.parse(sessionStorage.getItem("prev-chat-messages"))
  );
});

QUnit.module("Test toggle-button", {
  after() {
    window.setChatState("chat-collapsed");
    window.changeChatState();
  }
});
QUnit.test("should change chat state", function test(assert) {
  var prevChatState = localStorage.getItem("chat");
  document.getElementById("chat-toggle-button").onclick();
  assert.notEqual(localStorage.getItem("chat"), prevChatState);
});
QUnit.test("should change chat style", function test(assert) {
  var prevChatStyle = document.getElementById("chat").classList[1];
  document.getElementById("chat-toggle-button").onclick();
  assert.notEqual(document.getElementById("chat").classList[1], prevChatStyle);
});

QUnit.module("Test send button");
QUnit.test("should save new message to localStorage", function test(assert) {
  var messages;
  var done;
  var prevMessagesLength = 0;
  assert.timeout(15000);
  messages = JSON.parse(localStorage.getItem("chat-messages"));
  if (messages !== null) {
    prevMessagesLength = messages.length;
  }
  done = assert.async();
  setTimeout(function asyncAssertion() {
    document.getElementById("chat-input-txt").value = "Тестовое сообщение";
    document.getElementById("chat-message-button").onclick();
    assert.ok(
      JSON.parse(localStorage.getItem("chat-messages")).length -
        prevMessagesLength >
        0
    );
    done();
  }, 100);
});
QUnit.test("should append new message to the form", function test(assert) {
  var dateContainer;
  var done;
  var testMessageObject = new window.Message(
    new Date(),
    "Вы:",
    "Тестовое сообщение"
  );
  assert.timeout(15000);
  done = assert.async();
  setTimeout(function asyncAssertion() {
    document.getElementById("chat-input-txt").value = "Тестовое сообщение";
    document.getElementById("chat-message-button").onclick();
    dateContainer = document.getElementById(
      "chat-"
        .concat(testMessageObject.day)
        .concat("-")
        .concat(testMessageObject.month)
    );
    assert.ok(dateContainer !== null);
    assert.ok(dateContainer.getElementsByTagName("div").length > 0);
    done();
  }, 100);
});
QUnit.test("should have proper message format", function test(assert) {
  var dateContainerChildren;
  var done;
  var testMessageObject = new window.Message(
    new Date(),
    "Вы:",
    "Тестовое сообщение"
  );
  assert.timeout(15000);
  done = assert.async();
  setTimeout(function asyncAssertion() {
    document.getElementById("chat-input-txt").value = "Тестовое сообщение";
    document.getElementById("chat-message-button").onclick();
    dateContainerChildren = document
      .getElementById(
        "chat-"
          .concat(testMessageObject.day)
          .concat("-")
          .concat(testMessageObject.month)
      )
      .getElementsByTagName("div");
    assert.equal(dateContainerChildren[0].innerHTML, testMessageObject.time);
    assert.equal(dateContainerChildren[1].innerHTML, testMessageObject.sender);
    assert.equal(dateContainerChildren[2].innerHTML, testMessageObject.body);
    done();
  }, 100);
});
QUnit.test(
  "should save reply to localStorage on 15 seconds delay",
  function test(assert) {
    var done;
    var inner;
    var prevMessagesLength;
    assert.timeout(25000);
    done = assert.async();
    setTimeout(function asyncAssertion() {
      document.getElementById("chat-input-txt").value = "Тестовое сообщение";
      document.getElementById("chat-message-button").onclick();
      prevMessagesLength = JSON.parse(localStorage.getItem("chat-messages"))
        .length;
      inner = assert.async();
      setTimeout(function asyncReplyAssertion() {
        assert.ok(
          JSON.parse(localStorage.getItem("chat-messages")).length -
            prevMessagesLength >
            0
        );
        inner();
      }, 15000);
      done();
    }, 100);
  }
);
QUnit.test("should append reply to the form", function test(assert) {
  var done;
  var inner;
  var prevDateContainerChildrenAmount;
  var testMessageObject = new window.Message(
    new Date(),
    "Вы:",
    "Тестовое сообщение"
  );
  var dateContainerId = "chat-"
    .concat(testMessageObject.day)
    .concat("-")
    .concat(testMessageObject.month);
  assert.timeout(25000);
  done = assert.async();
  setTimeout(function asyncAssertion() {
    document.getElementById("chat-input-txt").value = "Тестовое сообщение";
    document.getElementById("chat-message-button").onclick();
    prevDateContainerChildrenAmount = document
      .getElementById(dateContainerId)
      .getElementsByTagName("div").length;
    inner = assert.async();
    setTimeout(function asyncReplyAssertion() {
      assert.ok(
        document.getElementById(dateContainerId).getElementsByTagName("div")
          .length -
          prevDateContainerChildrenAmount >
          0
      );
      inner();
    }, 15000);
    done();
  }, 100);
});
QUnit.test("should have proper reply format", function test(assert) {
  var done;
  var inner;
  var dateContainerChildren;
  var testMessageObject = new window.Message(
    new Date(),
    "Вы:",
    "Тестовое сообщение"
  );
  var dateContainerId = "chat-"
    .concat(testMessageObject.day)
    .concat("-")
    .concat(testMessageObject.month);
  var testMessageReply = new window.Message(
    new Date(),
    "Бот:",
    "Ответ на ".concat(JSON.stringify(testMessageObject.body).toUpperCase())
  );
  assert.timeout(25000);
  done = assert.async();
  setTimeout(function asyncAssertion() {
    document.getElementById("chat-input-txt").value = "Тестовое сообщение";
    document.getElementById("chat-message-button").onclick();
    inner = assert.async();
    setTimeout(function asyncReplyAssertion() {
      dateContainerChildren = document
        .getElementById(dateContainerId)
        .getElementsByTagName("div");
      assert.equal(
        dateContainerChildren[dateContainerChildren.length - 3].innerHTML,
        testMessageReply.time
      );
      assert.equal(
        dateContainerChildren[dateContainerChildren.length - 2].innerHTML,
        testMessageReply.sender
      );
      assert.equal(
        dateContainerChildren[dateContainerChildren.length - 1].innerHTML,
        testMessageReply.body
      );
      inner();
    }, 15000);
    done();
  }, 100);
});
