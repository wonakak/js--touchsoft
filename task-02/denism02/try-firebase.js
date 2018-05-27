/*
fetch("https://superchat-firebase.firebaseio.com/settings/1111-2222.json", {
    method: 'PUT',
    body: '{ "title" : "2222" }',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
    }).then(r => r.json())
   .then(console.log);

fetch('https://superchat-firebase.firebaseio.com/settings/1111-2222.json')
   .then(r => r.json())
   .then(console.log);

*/
var databaseURL = "https://superchat-firebase.firebaseio.com";
var addSingleItem = function addSingleItem0() {
  fetch(databaseURL + '/single.json', {
    method: 'PUT',
    body: JSON.stringify(
        {
          date: new Date(),
          title: "title"
        }
    ),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(function response0(response) {
    return response.json();
  })
  .then(console.log); // eslint-disable-line no-console
};

var addListItem = function addListItem0() {
  fetch(databaseURL + '/list.json', {
    method: 'POST',
    body: JSON.stringify(
        {
          date: new Date(),
          title: "list"
        }
    ),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(function response0(response) {
    return response.json();
  })
  .then(console.log); // eslint-disable-line no-console
};

var addListItemArray = function addListItemArray0() {
  fetch(databaseURL + '/array.json', {
    method: 'POST',
    body: JSON.stringify([{
          date: new Date(),
          title: "array11"
        },
          {
            date: new Date(),
            title: "array22"
          }]
    ),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(function response0(response) {
    return response.json();
  })
  .then(console.log); // eslint-disable-line no-console
};

var readSingleItem = function readSingleItem0() {
  fetch(databaseURL + '/single.json', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(function response0(response) {
    return response.json();
  })
  .then(console.log); // eslint-disable-line no-console
};

var readListItem = function readListItem0() {
  fetch(databaseURL + '/list.json', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(function response0(response) {
    return response.json();
  })
  .then(console.log); // eslint-disable-line no-console
};
var readListItemValues = function readListItemValues0() {
  fetch(databaseURL + '/list.json', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(function response0(response) {
    return Object.values(response.json());
    /* .map(function mapper0(item) {
      return item[0];
    }); */
  })
  .then(console.log); // eslint-disable-line no-console
};

var readAll = function readAll0() {
  fetch(databaseURL + '/.json', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(function response0(response) {
    return response.json();
  })
  .then(console.log); // eslint-disable-line no-console
};
/*
fetch('https://besomhead-chat.firebaseio.com/.json')
   .then(r => r.json())
   .then(console.log);

fetch('https://superchat-firebase.firebaseio.com/settings/1111-2222/title.json')
   .then(r => r.json())
   .then(console.log);

 fetch('https://superchat-firebase.firebaseio.com/settings/9086919C-D577-4EFA-A486-72409A2C3E61/msgsCount.json')
   .then(r => r.json())
   .then(console.log);

fetch('https://touchsoftchat.firebaseio.com/list.json')
   .then(r => r.json())
   .then(obj => Object.values(obj))
   .then(list => list.map(i => i[0]))
   .then(console.log)
*/
window.addSingleItem = addSingleItem;
window.addListItem = addListItem;
window.addListItemArray = addListItemArray;
window.readSingleItem = readSingleItem;
window.readListItem = readListItem;
window.readListItemValues = readListItemValues;
window.readAll = readAll;
