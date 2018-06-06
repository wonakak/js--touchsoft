/* global checkTime QUnit createFeedback createCollapsedFeedback hideFeedback checkWindow getReplyForMessage sendMessage */
function clearWorkSpace() {
    var elem;
    elem = document.getElementById("elemShowFeedback");
    if (elem) {
        document.body.removeChild(elem);
    }
    elem = document.getElementById("feedBack");
    if (elem) {
        document.body.removeChild(elem);
    }
    localStorage.clear();
}

QUnit.test("Time change", function test (assert) {
    assert.equal(checkTime(9), "09", "Equal");
    assert.notEqual(checkTime(9), "19", "Not equal");
});
QUnit.module("Create and show");
QUnit.test("Create feedBack", function test (assert) {
    localStorage.setItem("message", "test");
    createFeedback();
    assert.ok(document.getElementById("feedBack"), "feedBack 1 show");
    assert.equal(document.getElementById("messageHistory").value, "test", "content correct");
});

QUnit.test("Create collapsed feedBack", function test (assert) {
    createCollapsedFeedback();
    assert.ok(
        document.getElementById("elemShowFeedback"),
        "collapsed feedBack created"
    );
});

QUnit.test("Show and hide feedBack test", function test (assert) {
    clearWorkSpace();
    createFeedback();
    hideFeedback();
    assert.ok(
        document.getElementById("elemShowFeedback"),
        "collapse feedBack show"
    );
    assert.ok(document.getElementById("feedBack") === null);
});
QUnit.module("Check session storage");
QUnit.test("Check window test", function test (assert) {
    clearWorkSpace();
    localStorage.setItem("isOpen", "button");
    checkWindow();
    assert.ok(
        document.getElementById("elemShowFeedback"),
        "collapse feedBack created"
    );
    clearWorkSpace();
    localStorage.setItem("isOpen", "feedBack");
    checkWindow();
    assert.ok(document.getElementById("feedBack"), "feedBack created");
});
QUnit.module("Send message and response");
QUnit.test("Send message test", function test (assert) {
    var date = new Date();
    var minute = checkTime(date.getMinutes());
    var hour = checkTime(date.getHours());
    var message = "".concat("\n".concat([hour, minute].join(":").concat(" You: ".concat("test"))));
    var messageArea;
    var messageHistory;
    clearWorkSpace();
    createFeedback();
    messageArea = document.getElementById("messageArea");
    messageArea.value = "test";
    sendMessage();
    messageHistory = document.getElementById("messageHistory").value;
    assert.equal(
        message,
        localStorage.getItem("message"),
        "value in localStorage"
    );
    assert.equal(messageHistory, message, "true value in chat");
});

QUnit.test("response to message", function test (assert) {
    var messageHistory;
    var date = new Date();
    var minute = checkTime(date.getMinutes());
    var hour = checkTime(date.getHours());
    var correctMessageHistory = "".concat("\n".concat([hour, minute].join(":").concat(" Bot: Response to '".concat("test".concat("'")))));
    clearWorkSpace();
    createFeedback();
    localStorage.setItem("message", "");
    getReplyForMessage("test")();
    messageHistory = document.getElementById("messageHistory").value;
    assert.equal(messageHistory, correctMessageHistory, "correct response");
});
QUnit.module("test send by press button");
QUnit.test("send message by pressing the button", function test (assert) {
    var messageArea;
    var sendButton;
    var date = new Date();
    var minute = checkTime(date.getMinutes());
    var hour = checkTime(date.getHours());
    var message = "".concat("\n".concat([hour, minute].join(":").concat(" You: ".concat("test"))));
    clearWorkSpace();
    createFeedback();
    messageArea = document.getElementById("messageArea");
    sendButton = document.getElementById("sendMessageButton");
    messageArea.value = "test";
    sendButton.click();
    assert.equal(
        message,
        document.getElementById("messageHistory").value,
        "correct send message"
    );
});
QUnit.module("test collapse and maximize by press button");
QUnit.test("collapse feedBack", function test (assert) {
    clearWorkSpace();
    createFeedback();
    assert.ok(document.getElementById("feedBack"), "feedBack show");
    document.getElementById("collapse").click();
    assert.ok(
        document.getElementById("elemShowFeedback"),
        "collapse feedBack show"
    );
    assert.ok(document.getElementById("feedBack") == null, "feedBack not show");
});
QUnit.test("maximize feedBack", function test (assert) {
    clearWorkSpace();
    createCollapsedFeedback();
    assert.ok(document.getElementById("elemShowFeedback"), "collapse feedBack show");
    document.getElementById("maximize").click();
    assert.ok(document.getElementById("feedBack"), "feedBack show");
    assert.ok(document.getElementById("elemShowFeedback") == null, "collapse feedBack not show");
    clearWorkSpace();
});
