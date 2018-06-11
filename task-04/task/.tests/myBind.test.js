/* eslint-disable */
/* global describe, it, assert, beforeEach, afterEach */

describe('.myBind', function() {
  var func;
  var obj;
  var counter;
  var originalBind = Function.prototype.bind;
  beforeEach(function() {
    counter = 0;
    Function.prototype.bind = null;
    func = function(val) {
      counter++;
      return [val, this.name];
    };
    obj = {
      name: 'Some dummy context'
    };
  });
  afterEach(function() {
    Function.prototype.bind = originalBind;
  });
  it('функция', function() {
    assert.isOk(typeof func.myBind === 'function');
  });
  it('Возвращает фукнцию', function() {
    assert.isOk(typeof function() {}.myBind({}) === 'function');
    assert.isOk(typeof function() {}.myBind(null) === 'function');
  });
  it('не использует встроенный .bind', function() {
    assert.isOk(func.myBind.toString().indexOf('.bind') < 0);
  });
  it('Результат вызывает оригинальную фукнцию', function() {
    assert.isOk(counter === 0);
    const binded = func.myBind({});
    binded();
    assert.isOk(counter === 1);
    binded();
    assert.isOk(counter === 2);
  });
  it('Вызывает с правильным контекстом', function() {
    var context = { dummy: 'context' };
    const binded = function() {
      assert.isOk(this === context);
    }.myBind(context);
    binded();
  });
  it('Пробрасывает параметры контекстом', function() {
    (function() {
      assert.isOk(arguments.length === 0);
    }.myBind({})());
    (function() {
      assert.isOk(arguments.length === 1);
      assert.isOk(arguments[0] === 1);
    }.myBind({})(1));
    (function() {
      assert.isOk(arguments.length === 3);
      assert.isOk(arguments[0] === 1);
      assert.isOk(arguments[1] === 2);
      assert.isOk(arguments[2] === 'три');
    }.myBind({})(1, 2, 'три'));
  });
});
