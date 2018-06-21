/* global QUnit */
/* global chat */
/* global AdminChat */
/* global Message */
/* global dashboard */

var test = QUnit.test;

QUnit.module('About dashboard');



test('Dashboard container exists', function result(assert) {
    var container = document.getElementById('container');
    assert.ok(container !== null);
});

test('Menu container is exists', function result(assert) {
    var menu = document.getElementById('menu');
    assert.ok(menu !== null);
});

test('Chat container is exists', function result(assert) {
    var chat = document.getElementById('chat');
    assert.ok(chat !== null);
});

test('Dashboard object is created', function result(assert) {
    assert.ok(dashboard !== undefined);
});

test('Chat is created', function result(assert) {
   assert.ok (chat !== undefined);
});

test('Chat for admin', function result(assert) {
   assert.ok(chat instanceof AdminChat);
});

test('Close button has a listener ', function result(assert) {
    var closeButton = document.getElementById('button-close-dashboard');
    var activeContainer = document.getElementById('active-container');
    var click = new Event('click');
    closeButton.dispatchEvent(click);
    assert.ok(activeContainer.classList.contains('hide'));
});

test('Clear an user list containe', function result(assert) {
    var containerForUsers = document.getElementById('user-list');
    dashboard.clearUserListContainer();
    assert.equal('', containerForUsers.innerHTML);
});

test('Sort select has listener', function result(assert) {
    var sortElement = document.getElementById('sort');
    var saver = {function: dashboard.showUsers, value: dashboard.sort};
    var event = new Event('change');
    var flag = false;
    dashboard.showUsers = function showUsers(){
        flag = true;
    };
    sortElement.dispatchEvent(event);
    dashboard.showUsers = saver.function;
    dashboard.sort = saver.value;
    assert.ok(flag === true);
});

test('Init user list', function result(assert) {
   var done = assert.async();
   dashboard.initUserChatsList().then( function returnTrue(data) {
           assert.ok(data === true);
           done();
       }
   );
});

test('Get users', function result(assert){
    var done = assert.async();
    dashboard.getUsers().then(function returnTrue() {
       assert.ok(true);
       done();
    }).catch(function returnFalse() {
       assert.ok(false);
       done();
    })
});

QUnit.module('About message');

test('Save messages', function result(assert) {
    var done = assert.async();
    var promise = new Promise(function save(resolve) {
        setTimeout(function saveMessage() {
            var message = new Message('test', 'message', new Date().getTime());
            message.saveMessage();
            resolve(true)
        }, 2000);
    });
    promise.then(function returnTrue() {
        assert.ok(true);
        done();
    }).catch(function returnFalse() {
        assert.ok(false);
        done();
    });
});

QUnit.module('About Chat');

test('Get messages by chat UID', function result(assert) {
    var done = assert.async();
    chat.getMessagesByChatUID('uid').then(function returnTrue() {
        assert.ok(true);
        done();
    }).catch(function returnFalse() {
        assert.ok(false);
        done();
    })
});