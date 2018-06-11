/* global QUnit */
/* global window */
QUnit.module("Test initial page rendering");
QUnit.test("should append all config options", function test(assert) {
  assert.notEqual(
    document.getElementById("chat-configurator-chat-title"),
    null
  );
  assert.notEqual(document.getElementById("chat-configurator-bot-name"), null);
  assert.notEqual(document.getElementById("chat-configurator-chat-url"), null);
  assert.notEqual(
    document.getElementById("chat-configurator-chat-css-class"),
    null
  );
  assert.notEqual(
    document.getElementById("chat-configurator-chat-position"),
    null
  );
  assert.notEqual(
    document.getElementById("chat-configurator-ui-minimize"),
    null
  );
  assert.notEqual(document.getElementById("chat-configurator-ui-drag"), null);
  assert.notEqual(
    document.getElementById("chat-configurator-ui-require-name"),
    null
  );
  assert.notEqual(
    document.getElementById("chat-configurator-ui-show-date"),
    null
  );
  assert.notEqual(document.getElementById("chat-configurator-network"), null);
  assert.notEqual(document.getElementById("chat-configurator-code"), null);
});
QUnit.test("should set default config options", function test(assert) {
  assert.equal(
    document.getElementById("chat-configurator-chat-title").value,
    "Чат"
  );
  assert.equal(
    document.getElementById("chat-configurator-bot-name").value,
    "Бот"
  );
  assert.equal(
    document.getElementById("chat-configurator-chat-url").value,
    "https://besomhead-chat.firebaseio.com/"
  );
  assert.equal(
    document.getElementById("chat-configurator-chat-css-class").value,
    "chat-container"
  );
  assert.ok(
    document.getElementById("chat-configurator-chat-position-right").selected
  );
  assert.ok(
    !document.getElementById("chat-configurator-chat-position-left").selected
  );
  assert.ok(document.getElementById("chat-configurator-ui-minimize").checked);
  assert.ok(!document.getElementById("chat-configurator-ui-drag").checked);
  assert.ok(
    !document.getElementById("chat-configurator-ui-require-name").checked
  );
  assert.ok(document.getElementById("chat-configurator-ui-show-date").checked);
  assert.ok(!document.getElementById("chat-configurator-network-xhr").checked);
  assert.ok(document.getElementById("chat-configurator-network-fetch").checked);
});
QUnit.test("should create code example based on default config", function test(
  assert
) {
  var codeExample = document.getElementById("chat-configurator-code-source")
    .value;
  assert.ok(codeExample.length > 0);
  assert.ok(codeExample.indexOf("chatTitle='Чат'") !== -1);
  assert.ok(codeExample.indexOf("botName='Бот'") !== -1);
  assert.ok(
    codeExample.indexOf("chatURL='https://besomhead-chat.firebaseio.com/'") !==
      -1
  );
  assert.ok(codeExample.indexOf("cssClass='chat-container'") !== -1);
  assert.ok(codeExample.indexOf("position='right'") !== -1);
  assert.ok(codeExample.indexOf("allowMinimize='true'") !== -1);
  assert.ok(codeExample.indexOf("allowDrag='false'") !== -1);
  assert.ok(codeExample.indexOf("requireName='false'") !== -1);
  assert.ok(codeExample.indexOf("showDateTime='true'") !== -1);
  assert.ok(codeExample.indexOf("requests='fetch'") !== -1);
});

QUnit.module("Test event handlers");
QUnit.test("should change chat title", function test(assert) {
  var event = new Event("change");
  document.getElementById("chat-configurator-chat-title").value = "Testing";
  document.getElementById("chat-configurator-chat-title").dispatchEvent(event);
  assert.ok(
    document
      .getElementById("chat-configurator-code-source")
      .value.indexOf("chatTitle='Testing'") !== -1
  );
});
QUnit.test("should change bot name", function test(assert) {
  var event = new Event("change");
  document.getElementById("chat-configurator-bot-name").value = "Helper";
  document.getElementById("chat-configurator-bot-name").dispatchEvent(event);
  assert.ok(
    document
      .getElementById("chat-configurator-code-source")
      .value.indexOf("botName='Helper'") !== -1
  );
});
QUnit.test("should change chat URL", function test(assert) {
  var event = new Event("change");
  document.getElementById("chat-configurator-chat-url").value =
    "https://testcase.com";
  document.getElementById("chat-configurator-chat-url").dispatchEvent(event);
  assert.ok(
    document
      .getElementById("chat-configurator-code-source")
      .value.indexOf("chatURL='https://testcase.com'") !== -1
  );
});
QUnit.test("should change CSS class", function test(assert) {
  var event = new Event("change");
  document.getElementById("chat-configurator-chat-css-class").value =
    "chat-root";
  document
    .getElementById("chat-configurator-chat-css-class")
    .dispatchEvent(event);
  assert.ok(
    document
      .getElementById("chat-configurator-code-source")
      .value.indexOf("cssClass='chat-root'") !== -1
  );
});
QUnit.test("should change chat position", function test(assert) {
  var event = new Event("change");
  document.getElementById(
    "chat-configurator-chat-position-left"
  ).selected = true;
  document
    .getElementById("chat-configurator-chat-position")
    .dispatchEvent(event);
  assert.ok(
    document
      .getElementById("chat-configurator-code-source")
      .value.indexOf("position='left'") !== -1
  );
});
QUnit.test("should disable minimization", function test(assert) {
  var event = new Event("change");
  document.getElementById("chat-configurator-ui-minimize").checked = false;
  document.getElementById("chat-configurator-ui-minimize").dispatchEvent(event);
  assert.ok(
    document
      .getElementById("chat-configurator-code-source")
      .value.indexOf("allowMinimize='false'") !== -1
  );
});
QUnit.test("should enable Drag'n'Drop", function test(assert) {
  var event = new Event("change");
  document.getElementById("chat-configurator-ui-drag").checked = true;
  document.getElementById("chat-configurator-ui-drag").dispatchEvent(event);
  assert.ok(
    document
      .getElementById("chat-configurator-code-source")
      .value.indexOf("allowDrag='true'") !== -1
  );
});
QUnit.test("should require name", function test(assert) {
  var event = new Event("change");
  document.getElementById("chat-configurator-ui-require-name").checked = true;
  document
    .getElementById("chat-configurator-ui-require-name")
    .dispatchEvent(event);
  assert.ok(
    document
      .getElementById("chat-configurator-code-source")
      .value.indexOf("requireName='true'") !== -1
  );
});
QUnit.test("should disable date and time", function test(assert) {
  var event = new Event("change");
  document.getElementById("chat-configurator-ui-show-date").checked = false;
  document
    .getElementById("chat-configurator-ui-show-date")
    .dispatchEvent(event);
  assert.ok(
    document
      .getElementById("chat-configurator-code-source")
      .value.indexOf("showDateTime='false'") !== -1
  );
});
QUnit.test("should select only one request type", function test(assert) {
  var event = new Event("change");
  document.getElementById("chat-configurator-network-xhr").checked = true;
  document.getElementById("chat-configurator-network-xhr").dispatchEvent(event);
  assert.ok(
    !document.getElementById("chat-configurator-network-fetch").checked
  );
  document.getElementById("chat-configurator-network-fetch").checked = true;
});
QUnit.test("should change request type", function test(assert) {
  var event = new Event("change");
  document.getElementById("chat-configurator-network-xhr").checked = true;
  document.getElementById("chat-configurator-network-xhr").dispatchEvent(event);
  assert.ok(
    document
      .getElementById("chat-configurator-code-source")
      .value.indexOf("requests='xhr'") !== -1
  );
});
