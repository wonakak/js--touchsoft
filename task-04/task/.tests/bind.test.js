/* eslint-disable */
/* global describe, it, assert, beforeEach, afterEach */
describe('bind', function() {
  var func;
  var obj;
  var counter;
  var originalBind;
  beforeEach(function() {
    counter = 0;
    func = function(val) {
      counter++;
      return [val, this.name];
    };
    obj = {
      name: 'Some dummy context'
    };
    var originalBind = Function.prototype.bind;
  });
  afterEach(function() {
    Function.prototype.bind = originalBind;
  });
  it('функция', function() {
    assert.isOk(typeof bind === 'function');
  });
  it('Возвращает фукнцию', function() {
    assert.isOk(typeof bind(function() {}, {}) === 'function');
    assert.isOk(typeof bind(function() {}, null) === 'function');
  });
  it('Результат вызывает оригинальную фукнцию', function() {
    assert.isOk(counter === 0);
    let binded = bind(func, {});
    binded();
    assert.isOk(counter === 1);
    binded();
    assert.isOk(counter === 2);
  });
  it('Вызывает с правильным контекстом', function() {
    var context = { dummy: 'context' };
    const binded = bind(function() {
      assert.isOk(this === context);
    }, context);
    binded();
  });
  it('Пробрасывает параметры контекстом', function() {
    bind(function() {
      assert.isOk(arguments.length === 0);
    }, {})();
    bind(function() {
      assert.isOk(arguments.length === 1);
      assert.isOk(arguments[0] === 1);
    }, {})(1);
    bind(function() {
      assert.isOk(arguments.length === 3);
      assert.isOk(arguments[0] === 1);
      assert.isOk(arguments[1] === 2);
      assert.isOk(arguments[2] === 'три');
    }, {})(1, 2, 'три');
  });
});
