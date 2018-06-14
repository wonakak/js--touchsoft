/* global QUnit */
/* global dashboardDataSource */
/* global userListManager */
/* global userListManagerConfig */
/* global chatManager */
/* global chatManagerConfig */
var tests = QUnit.test;
var module = QUnit.module;
var testUserId = "TestUser1528804945467";
module("dashboardDataSource tests");
tests(
    "dashboardDataSource.oneUserAPI.getUserData should receive valid data",
    function test(assert) {
        var done = assert.async();
        dashboardDataSource.oneUserAPI
            .getUserData(testUserId)
            .then(function getData(data) {
                assert.equal(
                    typeof data.readLastMessage,
                    "boolean",
                    " readLastMessage has valid type"
                );
                assert.equal(
                    typeof data.sendNewMessage,
                    "boolean",
                    " sendNewMessage has valid type"
                );
                assert.equal(
                    typeof data.messages,
                    "object",
                    " messages has valid type"
                );
                assert.equal(
                    typeof data.settings,
                    "object",
                    " settings has valid type"
                );
            })
            .then(function setDone() {
                done();
            });
    }
);
tests("sendMessageToUser should send message to dataBase", function test(
    assert
) {
    var done = assert.async();
    var testData;
    var testMessageObject = {
        date: "11",
        message: "testMessage",
        user: testUserId
    };
    dashboardDataSource.oneUserAPI
        .sendMessageToUser(testUserId, testMessageObject)
        .then(function sendMess() {
            dashboardDataSource.oneUserAPI
                .getUserData(testUserId)
                .then(function getData(data) {
                    Object.keys(data.messages).map(function getElem(elem) {
                        testData = data.messages[elem][0].message;
                        return true;
                    });
                    assert.equal(
                        testData,
                        "testMessage",
                        " sendMessageToUser has valid type"
                    );
                })
                .then(function setDone() {
                    done();
                });
        });
});
tests("setUserSettings should send user settings to dataBase", function test(
    assert
) {
    var done = assert.async();
    var testData;
    var testUserSettings = {
        isMinimize: true,
        lastOnline: 1,
        readLastMessage: true,
        sendNewMessage: true,
        userName: "TestUser"
    };
    dashboardDataSource.oneUserAPI
        .setUserSettings(testUserId, testUserSettings)
        .then(function setUsSet() {
            dashboardDataSource.oneUserAPI
                .getUserData(testUserId)
                .then(function getData(data) {
                    testData = data.settings[0].userSettings;
                    assert.equal(testData.isMinimize, true, " isMinimize has valid data");
                    assert.equal(testData.lastOnline, 1, " lastOnline has valid data");
                    assert.equal(
                        testData.readLastMessage,
                        true,
                        "readLastMessage has valid data"
                    );
                    assert.equal(
                        testData.sendNewMessage,
                        true,
                        "sendNewMessage has valid data"
                    );
                    assert.equal(
                        testData.userName,
                        "TestUser",
                        "userName has valid data"
                    );
                })
                .then(function setDone() {
                    done();
                });
        });
});
tests(
    "setAmountOfNoReadMessage should send amount of noReadMessages to dataBase",
    function test(assert) {
        var done = assert.async();
        var testData;
        dashboardDataSource.oneUserAPI
            .setAmountOfNoReadMessage(testUserId, 15)
            .then(function setNoReadCount() {
                dashboardDataSource.oneUserAPI
                    .getUserData(testUserId)
                    .then(function getData(data) {
                        testData = data.noReadMessage.count;
                        assert.equal(testData, 15, " setAmountOfNoReadMessage true");
                    })
                    .then(function setDone() {
                        done();
                    });
            });
    }
);
tests("setField should set a field to dataBase", function test(assert) {
    var done = assert.async();
    var testField = "testField";
    var testData;
    dashboardDataSource.oneUserAPI
        .setField(testUserId, testField, 99)
        .then(function setFields() {
            dashboardDataSource.oneUserAPI
                .getUserData(testUserId)
                .then(function getData(data) {
                    testData = data[testField];
                    assert.equal(testData, 99, " setField true");
                })
                .then(function setDone() {
                    done();
                });
        });
});
tests("getField should get a field from dataBase", function test(assert) {
    var done = assert.async();
    var testField = "testField";
    dashboardDataSource.oneUserAPI
        .getField(testUserId, testField)
        .then(function getData(data) {
            assert.equal(data, 99, " getField true");
        })
        .then(function setDone() {
            done();
        });
});
module("dashboardUserManager tests");
tests("createUserElement should valid div element", function test(assert) {
    var testData = userListManager.createUserElement(testUserId, true);
    assert.equal(
        testData.firstChild.tagName,
        "DIV",
        " element has valid tag name"
    );
    assert.equal(
        testData.lastChild.tagName,
        "DIV",
        " element has valid tag name"
    );
    assert.ok(
        testData.firstChild.classList.contains(
            userListManagerConfig.USER_ID_ELEMENT_CSS_CLASS
        ),
        " element has valid class name"
    );
    assert.ok(
        testData.lastChild.classList.contains(
            userListManagerConfig.USER_INDICATOR_CSS_CLASS_ONLINE
        ),
        " element has valid class name"
    );
    assert.ok(
        testData.classList.contains(userListManagerConfig.USER_ELEMENT_CSS_CLASS),
        " element has valid class name"
    );
});
tests("setUserList should set new uList", function test(assert) {
    var newList = { test: "testList" };
    userListManager.setUserList(newList);
    assert.equal(userListManager.uList.test, "testList", "setUserList true");
});
tests(
    "getUserFromUserListById should return key user on uList by userId",
    function test(assert) {
        var newList = { testKey: { userId: testUserId } };
        userListManager.setUserList(newList);
        assert.equal(
            userListManager.getUserFromUserListById(testUserId),
            "testKey",
            "getUserFromUserListById true"
        );
    }
);
tests("userIsOnline should return true if user is online", function test(
    assert
) {
    var date = new Date();
    var negativeConst = 100500;
    assert.equal(
        userListManager.userIsOnline(date.getTime()),
        true,
        "getUserFromUserListById true"
    );
    assert.equal(
        userListManager.userIsOnline(
            date.getTime() - userListManagerConfig.ONLINE_INTERVAL - negativeConst
        ),
        false,
        "userIsOnline true"
    );
});
tests("filterByName should filter name by str", function test(assert) {
    var newList = [
        {
            visible: true,
            userId: "1"
        },
        {
            visible: true,
            userId: "2"
        }
    ];
    userListManager.setUserList(newList);
    userListManager.filterByName("2");
    assert.ok(userListManager.uList[1].visible, "filterByName true");
    assert.notOk(userListManager.uList[0].visible, "filterByName true");
});
tests("sortUsersByField should sort by field", function test(assert) {
    var newList = [
        {
            visible: true,
            userId: "1"
        },
        {
            visible: true,
            userId: "2"
        }
    ];
    userListManager.setUserList(newList);
    userListManager.sortUsersByField("visible");
    assert.equal(newList[0].userId, "2", "sortUsersByField true");
    assert.equal(newList[1].userId, "1", "sortUsersByField true");
});
module("dashboardChatManager tests");
tests("createMessageElement should create valid message element", function test(
    assert
) {
    var message = "test";
    var messageDate = "testDate";
    var userName = "testUserName";
    var isRead = false;
    var innerHtml = messageDate + " " + userName + ": " + message;
    var messageElement = chatManager.createMessageElement(
        message,
        messageDate,
        userName,
        isRead
    );
    assert.equal(messageElement.tagName, "DIV", "tagName true");
    assert.equal(messageElement.innerText, innerHtml, "message true");
    assert.ok(
        messageElement.classList.contains(
            chatManagerConfig.CSS_USER_NOT_READ_MESSAGES
        ),
        "class true"
    );
});
tests("addMessageToMessageList should add message", function test(assert) {
    var message = "test";
    chatManager.messageList = [];
    chatManager.addMessageToMessageList(message);
    assert.equal(
        chatManager.messageList.length,
        1,
        "addMessageToMessageList true"
    );
});
tests(
    "updateMessageList should mark no read messages from admin",
    function test(assert) {
        var messageObj1 = chatManager.createMessageObject(
            "test1",
            "testDate",
            chatManagerConfig.DEFAULT_ADMIN_NAME,
            true
        );
        var messageObj2 = chatManager.createMessageObject(
            "test2",
            "testDate",
            chatManagerConfig.DEFAULT_ADMIN_NAME,
            true
        );
        var newMessageList = [messageObj1, messageObj2];
        chatManager.newMessagesCounter = 1;
        chatManager.updateMessageList(newMessageList);
        assert.ok(chatManager.messageList[0].read, "updateMessageList true");
        assert.notOk(chatManager.messageList[1].read, "updateMessageList true");
    }
);
