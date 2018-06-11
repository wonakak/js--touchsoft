/* eslint-disable */
/* global describe, it, assert, beforeEach, afterEach */
describe('sum', function() {
  it('функция', function() {
    assert.isOk(typeof sum === 'function');
  });
  it('по-умолчанию инициализируется нулем', function() {
    assert.isOk(+sum() === 0);
  });
  it('инициализируется числом', function() {
    assert.isOk(+sum(5) === 5);
  });
  it('складывает числа', function() {
    var s = sum(1);
    assert.isOk(+s(2) === 3);
    assert.isOk(+s(3) === 4);
    assert.isOk(+s(95) === 96);
  });
  it('складывает числа последовательно', function() {
    assert.isOk(+sum(1)(2) === 3);
    assert.isOk(+sum(5)(7)(9) === 21);

    var s = sum();
    for (var i = 0; i < 15; i++) {
      s = s(1);
    }
    assert.isOk(+s(1) === 16);
  });
  it('добавляет 0 по-умолчанию', function() {
    assert.isOk(+sum(4)() === 4);
    assert.isOk(+sum(7)()(2) === 9);
  });
  it('сумматоры независимые', function() {
    var s1 = sum(1);
    var s12 = s1(2);
    var s15 = s1(5);
    var s152 = s15(2);
    var s159 = s15(9);
    var s10 = s1();
    assert.isOk(+s1 === 1);
    assert.isOk(+s12 === 3);
    assert.isOk(+s15 === 6);
    assert.isOk(+s152 === 8);
    assert.isOk(+s159 === 15);
    assert.isOk(+s10 === 1);
  });
  it('может отработать много раз', function() {
    var s = sum();
    for (var i = 0; i < 999; i++) {
      s = s(1);
    }
    assert.isOk(+s() === 999);
  });
});
