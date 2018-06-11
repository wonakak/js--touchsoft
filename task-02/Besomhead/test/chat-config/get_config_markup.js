window.addEventListener("load", function getChatConfiguratorMarkUp() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://rawgit.com/Besomhead/js--touchsoft/besomhead-task-02/task-02/Besomhead/src/chat-config/chat_configurator.html",
    false
  );
  xhr.addEventListener("load", function onLoad() {
    document.getElementById("configurator-container").innerHTML =
      xhr.responseText;
  });
  xhr.addEventListener("error", function onError() {
    throw new Error(xhr.statusText);
  });
  xhr.send();
});
