/* eslint-disable */
function getChatBox() {
    return document.querySelector("div.mainContainer > div.box");
}

QUnit.test("Should clear transcript in storage and on screen", function (assert) {
    clearTranscriptInStorageAndOnScreen();
    assert.equal(getTranscriptArrayFromStorage().length, 0);
    assert.equal(document.getElementById("transcript-list").getElementsByTagName("tr").length, 0);
});

QUnit.test("Should read & write to local storage", function (assert) {
    var saved;
    var transcriptArray;
    var record = new Record("date=now", 'a', 'agent answer');
    clearTranscriptInStorageAndOnScreen();
    saveMessageToStorage(record);
    transcriptArray = getTranscriptArrayFromStorage();
    assert.equal(transcriptArray.length, 1);
    saved = transcriptArray.pop();
    assert.equal(saved.date, "date=now");
    assert.equal(saved.src, "a");
    assert.equal(saved.msg, "agent answer");
});

function toggleChatMaximizeMinimizeWithoutStorage(assert) {
    var chatBox = getChatBox();
    var minChat = chatBox.querySelector("#min-chat");
    var maxChat = chatBox.querySelector("#popup-chat");
    var maximized = maxChat.classList.contains("hidden-chat");
    if (maximized) {
        handleMinMaxChat(false);
        assert.notOk(minChat.classList.contains("hidden-chat"));
        assert.ok(maxChat.classList.contains("hidden-chat"));
    } else {
        handleMinMaxChat(true);
        assert.ok(minChat.classList.contains("hidden-chat"));
        assert.notOk(maxChat.classList.contains("hidden-chat"));
    }
}

function toggleChatMaximizeMinimizeWithStorage(assert) {
    var chatBox = getChatBox();
    var minChat = chatBox.querySelector("#min-chat");
    var maxChat = chatBox.querySelector("#popup-chat");
    var maximized = localStorage.getItem('maximized') || '0';
    if (maximized) {
        handleMinMaxChat(false);
        assert.equal(localStorage.getItem('maximized'), "0");
    } else {
        handleMinMaxChat(true);
        assert.equal(localStorage.getItem('maximized'), "1");
    }
}

QUnit.test("Should maximize & minimize chat (with css classes changes only)", function (assert) {
    toggleChatMaximizeMinimizeWithoutStorage(assert);
    toggleChatMaximizeMinimizeWithoutStorage(assert);
});


QUnit.test("Should maximize & minimize chat (with storage setting change only)", function (assert) {
    toggleChatMaximizeMinimizeWithStorage(assert);
    toggleChatMaximizeMinimizeWithStorage(assert);
});

QUnit.test("Should send AGENT message to screen & to storage", function (assert) {
    clearTranscriptInStorageAndOnScreen();
    handleMinMaxChat(true);
    var transcriptArray;
    var saved;
    var chatBox = getChatBox();
    var agentSendButton = chatBox.querySelector("#agent-send-button");
    var transcriptOnScreen = chatBox.querySelector("#transcript-list");
    assert.equal(transcriptOnScreen.getElementsByTagName("tr").length, 0);

    agentSendButton.click();

    transcriptArray = getTranscriptArrayFromStorage();
    assert.equal(transcriptArray.length, 1);
    saved = transcriptArray.pop();
    assert.equal(saved.src, "a");
    assert.equal(saved.msg, "agent answer");

    assert.equal(transcriptOnScreen.querySelectorAll(".tr-agent").length, 1);
    assert.equal(transcriptOnScreen.querySelectorAll(".td-agent").length, 1);
    assert.ok(transcriptOnScreen.querySelector(".td-agent").innerText.indexOf("agent answer") !== -1);
});

QUnit.test("Should send USER message to screen & to storage", function (assert) {
    clearTranscriptInStorageAndOnScreen();
    handleMinMaxChat(true);
    var transcriptArray;
    var saved;
    var chatBox = getChatBox();
    var userTextArea = chatBox.querySelector("#user-input");
    var userSendButton = chatBox.querySelector("#user-send-button");
    var transcriptOnScreen = chatBox.querySelector("#transcript-list");
    assert.equal(transcriptOnScreen.getElementsByTagName("tr").length, 0);

    userTextArea.value = "user message 1";
    userSendButton.click();

    transcriptArray = getTranscriptArrayFromStorage();
    assert.equal(transcriptArray.length, 1);
    saved = transcriptArray.pop();
    assert.equal(saved.src, "u");
    assert.equal(saved.msg, "user message 1");

    assert.equal(transcriptOnScreen.querySelectorAll(".tr-client").length, 1);
    assert.equal(transcriptOnScreen.querySelectorAll(".td-client").length, 1);
    assert.ok(transcriptOnScreen.querySelector(".td-client").innerText.indexOf("user message 1") !== -1);
});

QUnit.test("Should get auto answer from agent in 15 seconds", function (assert) {
    handleMinMaxChat(true);
    var transcriptArray;
    var chatBox = getChatBox();
    var userTextArea = chatBox.querySelector("#user-input");
    var userSendButton = chatBox.querySelector("#user-send-button");
    var transcriptOnScreen = chatBox.querySelector("#transcript-list");

    userTextArea.value = "user message 2";
    userSendButton.click();

    var done = assert.async();
    setTimeout(function () {
        assert.equal(transcriptOnScreen.querySelectorAll(".tr-agent").length, 2); // +1 from previous test
        assert.equal(transcriptOnScreen.querySelectorAll(".td-agent").length, 2);
        var answers = transcriptOnScreen.querySelectorAll(".td-agent");
        for (var i = 0; i < answers.length; i+=1) {
            assert.ok(answers[i].innerText.indexOf("Ответ на \"USER MESSAGE") !== -1);
        }
        done();
    }, 16000); // wait for auto-answer
});

QUnit.test("Should remove everything from screen and storage after click on 'Clear' button", function (assert) {
    handleMinMaxChat(true);
    var transcriptArray;
    var chatBox = getChatBox();
    var clearButton = chatBox.querySelector("#clear2");
    var transcriptOnScreen = chatBox.querySelector("#transcript-list");

    var done = assert.async();
    setTimeout(function () {
        clearButton.click();
        transcriptArray = getTranscriptArrayFromStorage();
        assert.equal(transcriptArray.length, 0);
        assert.equal(transcriptOnScreen.getElementsByTagName("tr").length, 0);
        done();
    }, 500); // wait for previous tests to complete
});

/*
QUnit.test("", function (assert) {

});

QUnit.test("", function (assert) {

});
*/
