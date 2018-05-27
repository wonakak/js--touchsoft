window.Listen2formUpdates = function MegaSuperUsefulChatForm() {
  var config = {
    title: "Default Chat title",
    botName: "Agent",
    cssClass: "YourCustomCss",
    position: "right",
    allowMinimize: true,
    allowDrag: true,
    showDateTime: true,
    requireName: true,
    requestsType: "unknown",
    databaseURL: "https://superchat-firebase.firebaseio.com"
  };
  var elements = {
    title: null,
    botName: null,
    cssClass: null,
    position: null,
    allowMinimize: null,
    allowDrag: null,
    showDateTime: null,
    requireName: null,
    reqxhr: null,
    reqfet: null,
    databaseURL: null
  };

  function generateCodeSnippet() {
    console.log(config);// eslint-disable-line no-console
    document.getElementById("result").innerText =
        "<script>(function(){new TsChat("+JSON.stringify(config)+");})();</script>";
  }

  function updateConfigValues(event) {
    var target = event.target;
    var key = target.name;
    var value = target.value;
    console.log(key + "=" + value);// eslint-disable-line no-console
    if (value === "on") { // read checked property
      if (key === "requestsType") {
        if (target.id === "reqxhr") {
          config[key] = "xhr";
        } else {
          config[key] = "fetch";
        }
      } else {
        config[key] = target.checked;
      }
    } else { // simply assign new text
      config[key] = value;
    }
  }

  function setDefaultValues(attr, el) {
    var defvalue = config[attr];
    console.log(attr + "||" + el + "||" + defvalue);// eslint-disable-line no-console
    if (defvalue !== null && defvalue !== undefined) {
      if (typeof defvalue === "boolean") {
        el.checked = true;
      } else {
        el.value = defvalue;
      }
    } else if (config.requestsType === "fetch" && attr === "reqfet") { // radio buttons
      el.checked = true;
    } else if (attr === "reqxhr") {
      el.checked = true;
    }
  }

  function addInputFieldsListeners() {
    var el;
    var keys = Object.keys(elements);
    keys.forEach(function elementIds(attr) {
      el = null;
      el = document.getElementById(attr);
      if (el !== null && el !== undefined) {
        elements[attr] = el;
        setDefaultValues(attr, el);
        el.addEventListener("change", updateConfigValues);
      }
    });
    console.log(elements);// eslint-disable-line no-console
    document.getElementById("generate").addEventListener("click",
        generateCodeSnippet);
  }

  window.addEventListener("load", function addInputFieldsListeners0() {
    addInputFieldsListeners();
  });
};

