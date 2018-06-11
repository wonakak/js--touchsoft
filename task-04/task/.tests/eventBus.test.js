/* eslint-disable */
/* global describe, it, assert, beforeEach, afterEach */

describe('eventBus', () => {
  it('is function', () => assert.isOk(typeof EventBus === 'function'));
  describe('trigger', () => {
    it('is method', () =>
      assert.isOk(typeof new EventBus().trigger === 'function'));
    it('takes 2 params', () =>
      assert.isOk(new EventBus().trigger.length === 2));
  });
  describe('on', () => {
    it('is method', () => assert.isOk(typeof new EventBus().on === 'function'));
    it('takes 2 params', () => assert.isOk(new EventBus().on.length === 2));
  });

  describe('off', () => {
    it('is function', () => {
      assert.isOk(typeof new EventBus().off === 'function');
    });
    it('cancel subscription', () => {
      var a = 1;
      var cb = () => a++;
      var eventBus = new EventBus();
      eventBus.on('xxx', cb);
      eventBus.trigger('xxx');
      eventBus.off('xxx', cb);
      eventBus.trigger('xxx');
      assert.isOk(a === 2, a + '===' + 2);
    });
    it('cancel correct subscription', () => {
      var a = 1;
      var b = 1;
      var cb1 = () => a++;
      var cb2 = () => b++;
      var eventBus = new EventBus();
      eventBus.on('xxx', cb1);
      eventBus.on('xxx', cb2);
      eventBus.trigger('xxx');
      eventBus.off('xxx', cb1);
      eventBus.trigger('xxx');
      assert.isOk(a === 2, a + '===' + 2);
      assert.isOk(b === 3, b + '===' + 3);
    });
  });

  describe('on vs trigger', () => {
    it('trigger calls hanlders from .on', () => {
      var a = 1;
      var eventBus = new EventBus();
      eventBus.on('some:event', () => a++);
      assert.isOk(a === 1, 'on do not call cb without trigger');
      eventBus.trigger('some:event');
      assert.isOk(a === 2, 'trigger calls cb from .on');
    });

    it('trigger pass params into cb', () => {
      var a = 1;
      var eventBus = new EventBus();
      eventBus.on('some:event', x => (a += x));
      assert.isOk(a === 1, 'on do not call cb without trigger');
      eventBus.trigger('some:event', 4);
      assert.isOk(a === 5, 'trigger calls cb from .on');
    });

    it('trigger pass multiple params into cb', () => {
      var a = 'a';
      var b = 'b';
      var eventBus = new EventBus();
      eventBus.on('some:event', (x, y) => (a = a + x + y));
      eventBus.on('some:event', (x, y, z, h) => (b = b + x + y + z + h));
      eventBus.trigger('some:event', 'x', 'y', 'z', 'h');
      assert.isOk(a === 'axy', a + '===' + 'axy');
      assert.isOk(b === 'bxyzh', b + '===' + 'bxyzh');
    });

    it('trigger calls all cbs', () => {
      var a = 1;
      var b = 1;
      var eventBus = new EventBus();
      eventBus.on('some:event', x => (a += x));
      eventBus.on('some:event', x => (b += x));
      assert.isOk(a === 1, 'on do not call cb without trigger');
      assert.isOk(b === 1, 'on do not call cb without trigger');
      eventBus.trigger('some:event', 4);
      assert.isOk(a === 5, 'trigger calls cb from .on');
      assert.isOk(b === 5, 'trigger calls cb from .on');
    });

    it('trigger works fine with no cbs', () => {
      var eventBus = new EventBus();
      eventBus.trigger('some:event', 4);
      assert.isOk(1 === 1, '.trigger does not break code with no cbs');
    });

    it('works fine with no functions as cb', () => {
      var eventBus = new EventBus();
      var a = 1;
      eventBus.on('xxx', () => a++);
      eventBus.on('xxx', 'HerTam');
      eventBus.trigger('xxx', 4);
      assert.isOk(
        a === 2,
        '.trigger does not break code with non-function param'
      );
    });
  });
});
