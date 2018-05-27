/* eslint-disable */
function addChatScriptToPage() {
    var script = document.createElement("script");
    script.setAttribute("src", "./chat01all.js");
    document.body.appendChild(script);
}

QUnit.test("MainContainer is missing without loaded chat", function (assert) {
    var chats = document.querySelectorAll(".mainContainer");
    assert.equal(chats.length, 0); // Actual --- Expected
});

QUnit.test("MainContainer is present after loading script", function (assert) {
    var done = assert.async(2);
    assert.equal(document.querySelectorAll(".mainContainer").length, 0);

    addChatScriptToPage();

    setTimeout(function () {
        initChat();
        done();
    }, 500); // wait for chat script to load

    setTimeout(function () {
        assert.equal(document.querySelectorAll(".mainContainer").length, 1);
        // check that it's minimized or maximized depending on storage value
        var maximized = localStorage.getItem("maximized") || "0";
        var minChat = document.getElementById("min-chat");
        var maxChat = document.getElementById("popup-chat");
        if (maximized === "1") {
            assert.ok(minChat.classList.contains("hidden-chat"));
            assert.notOk(maxChat.classList.contains("hidden-chat"));
        } else {
            assert.notOk(minChat.classList.contains("hidden-chat"));
            assert.ok(maxChat.classList.contains("hidden-chat"));
        }
        done();
    }, 1000); // wait for chat to initialize
});