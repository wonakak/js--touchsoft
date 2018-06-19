/* global checkTime QUnit createFeedback createCollapsedFeedback hideFeedback transferObject  */
var configObj = {
    title: "Chat",
    name: "Bot",
    url: "https://touch-soft-test.firebaseio.com/",
    CSS: "https://rawgit.com/fatexik/js--touchsoft/master/task-02/Fatexik/CSS/styles.css",
    positionLeft: false,
    allowMinimize: false,
    drag: false,
    requireName: false,
    showTime: false,
    network: "XHR",
    userName: "",
    collapsed: false
};

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
}


QUnit.test("Time change", function test(assert) {
    assert.equal(checkTime(9), "09", "Equal");
    assert.notEqual(checkTime(9), "19", "Not equal");
});
QUnit.module("Create and show");
QUnit.test("Create feedBack", function test(assert) {
    localStorage.setItem("message", "test");
    createFeedback();
    assert.ok(document.getElementById("feedBack"), "feedBack 1 show");
});

QUnit.test("Create collapsed feedBack", function test(assert) {
    createCollapsedFeedback();
    assert.ok(
        document.getElementById("elemShowFeedback"),
        "collapsed feedBack created"
    );
});

QUnit.test("Show and hide feedBack test", function test(assert) {
    clearWorkSpace();
    createFeedback();
    hideFeedback();
    assert.ok(
        document.getElementById("elemShowFeedback"),
        "collapse feedBack show"
    );
    assert.ok(document.getElementById("feedBack") === null);
});

QUnit.module("Check create User XHR");
QUnit.test("Get Config", function test(assert) {
    var name = configObj.name;
    var url = configObj.url;
    var network = configObj.network;
    var doneName = assert.async();
    var doneUrl = assert.async();
    var doneNetwork = assert.async();
    assert.expect(3);
    transferObject.getConfig("name").then(function getConfigName(value) {
        assert.equal(name, value, "Name config equal");
        doneName();
    });
    transferObject.getConfig("url").then(function getConfigURL(value) {
        assert.equal(url, value, "URL config equal");
        doneUrl();
    });
    transferObject.getConfig("network").then(function getConfigNetwork(value) {
        assert.equal(network, value, "Network config equal");
        doneNetwork();
    })
});
QUnit.module("Send message XHR");
QUnit.test("Send message", function test(assert) {
    var message = "test";
    var doneMessageSend = assert.async();
    var doneMessageCorrect = assert.async();
    assert.expect(2);
    transferObject.sendMessage(message).then(function sendMessage(value) {
            assert.ok(value, "Message Send");
            doneMessageSend();
        }
    );
    transferObject.getMessages().then(function getMessage(value) {
        assert.equal(message, value.pop(), "Message in dataBase correct");
        doneMessageCorrect();
    })
});
configObj.network = "fetch";
QUnit.module("Send message fetch");
QUnit.test("Send message", function test(assert) {
    var message = "test";
    var doneMessageSend = assert.async();
    var doneMessageCorrect = assert.async();
    assert.expect(2);
    transferObject.sendMessage(message).then(function sendMessage(value) {
            assert.ok(value, "Message Send");
            doneMessageSend();
        }
    );
    transferObject.getMessages().then(function getMessage(value) {
        assert.equal(message, value.pop(), "Message in dataBase correct");
        doneMessageCorrect();
    })
});
QUnit.module("Send message with name");
QUnit.test("Send message and name", function test(assert) {
    var doneMessageSend = assert.async();
    configObj.userName = "You";
    assert.expect(1);
    transferObject.sendMessage("test message").then(function sendMessage(value) {
        assert.ok(value, "Message send");
        doneMessageSend();
    });
});
