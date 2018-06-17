/* global listener, createPage, applyConfiguration, changeConfiguration, newConfig */
/* global QUnit */

(function() {
  document.removeEventListener('DOMContentLoaded', listener);
  createPage();
  applyConfiguration();
  changeConfiguration();
})();

function removePage() {
  var importTag = document.getElementById('idImportTag');
  setTimeout(document.body.removeChild(importTag), 1000);
}

QUnit.module('Check configuration page');

QUnit.test('Check type of config.', function(assert) {
  assert.ok(typeof newConfig === 'object', 'The test is successful');
});

QUnit.test('Check default settings.', function(assert) {
  assert.ok(newConfig.chatTitle === 'Chat', 'The test is successful');
  assert.ok(newConfig.botName === 'Bot', 'The test is successful');
  assert.ok(
    newConfig.chatUrl === 'https://tanyachatfb.firebaseio.com',
    'The test is successful'
  );
  assert.ok(newConfig.cssClass === 'tsChatGreen', 'The test is successful');
  assert.ok(newConfig.position === 'right', 'The test is successful');
  assert.ok(newConfig.allowToMinimize === false, 'The test is successful');
  assert.ok(newConfig.allowToDragAndDrop === false, 'The test is successful');
  assert.ok(newConfig.requireName === false, 'The test is successful');
  assert.ok(newConfig.showTime === false, 'The test is successful');
  assert.ok(newConfig.networkXHR === true, 'The test is successful');
  assert.ok(newConfig.networkFetch === false, 'The test is successful');
});

QUnit.module('Check settings changes');

QUnit.test('Check chat title change.', function(assert) {
  var change = new Event('change');
  document.getElementById('chatTitle').value = 'TanyaChat';
  document.getElementById('chatTitle').dispatchEvent(change);
  assert.ok(
    document.getElementById('generatedCode').innerText.indexOf('TanyaChat') !==
      -1,
    'The test is successful'
  );
});

QUnit.test('Check bot name change.', function(assert) {
  var change = new Event('change');
  document.getElementById('botName').value = 'Fil';
  document.getElementById('botName').dispatchEvent(change);
  assert.ok(
    document.getElementById('generatedCode').innerText.indexOf('Fil') !== -1,
    'The test is successful'
  );
});

QUnit.test('Check chat URL change.', function(assert) {
  var change = new Event('change');
  document.getElementById('chatUrl').value =
    'https://tanyachattest.firebaseio.com';
  document.getElementById('chatUrl').dispatchEvent(change);
  assert.ok(
    document
      .getElementById('generatedCode')
      .innerText.indexOf('https://tanyachattest.firebaseio.com') !== -1,
    'The test is successful'
  );
});

QUnit.test('Check css Class change.', function(assert) {
  var change = new Event('change');
  document.getElementById('cssClass').value = 'tsChatOrange';
  document.getElementById('cssClass').dispatchEvent(change);
  assert.ok(
    document
      .getElementById('generatedCode')
      .innerText.indexOf('tsChatOrange') !== -1,
    'The test is successful'
  );
});

QUnit.test('Check chat position change.', function(assert) {
  var change = new Event('change');
  document.getElementById('idSelectLeft').selected = true;
  document.getElementById('chatPositionSelect').dispatchEvent(change);
  assert.ok(
    document.getElementById('generatedCode').innerText.indexOf('left') !== -1,
    'The test is successful'
  );
});

QUnit.test('Check the operation of the checkbox "allowToMinimize".', function(
  assert
) {
  var change = new Event('change');
  document.getElementById('allowToMinimize').checked = true;
  document.getElementById('allowToMinimize').dispatchEvent(change);
  assert.ok(
    document
      .getElementById('generatedCode')
      .innerText.indexOf('allowToMinimize:true') !== -1,
    'The test is successful'
  );
});

QUnit.test(
  'Check the operation of the checkbox "allowToDragAndDrop".',
  function(assert) {
    var change = new Event('change');
    document.getElementById('allowToDragAndDrop').checked = true;
    document.getElementById('allowToDragAndDrop').dispatchEvent(change);
    assert.ok(
      document
        .getElementById('generatedCode')
        .innerText.indexOf('allowToDragAndDrop:true') !== -1,
      'The test is successful'
    );
  }
);

QUnit.test('Check the operation of the checkbox "requireName".', function(
  assert
) {
  var change = new Event('change');
  document.getElementById('requireName').checked = true;
  document.getElementById('requireName').dispatchEvent(change);
  assert.ok(
    document
      .getElementById('generatedCode')
      .innerText.indexOf('requireName:true') !== -1,
    'The test is successful'
  );
});
QUnit.test('Check the operation of the checkbox "showTime".', function(assert) {
  var change = new Event('change');
  document.getElementById('showTime').checked = true;
  document.getElementById('showTime').dispatchEvent(change);
  assert.ok(
    document
      .getElementById('generatedCode')
      .innerText.indexOf('showTime:true') !== -1,
    'The test is successful'
  );
});
QUnit.test('Check the operation of the radio buttons.', function(assert) {
  var change = new Event('change');
  document.getElementById('networkRadioFetch').checked = true;
  document.getElementById('networkRadioFetch').dispatchEvent(change);
  assert.ok(
    document
      .getElementById('generatedCode')
      .innerText.indexOf('networkFetch:true') !== -1,
    'The test is successful'
  );
  assert.ok(
    document
      .getElementById('generatedCode')
      .innerText.indexOf('networkXHR:false') !== -1,
    'The test is successful'
  );
});

setTimeout(removePage, 400);
