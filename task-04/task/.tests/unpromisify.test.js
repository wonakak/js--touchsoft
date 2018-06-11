/* eslint-disable */
/* global describe, it, assert, beforeEach, afterEach, unpromisify */
describe('unpromisify', () => {
  it('This is function', () => {
    assert.isTrue(typeof unpromisify === 'function');
  });
  it('Returns a function', () => {
    assert.isTrue(typeof unpromisify() === 'function');
  });
  it('Calls a promisify', done => {
    unpromisify(_ => Promise.resolve(done()))();
  });
  it('Calls the original functionwith transmitted arguments', done => {
    unpromisify(arg => Promise.resolve(arg))(
      10,
      (err, data) => (!err && data === 10 ? done() : 0)
    );
  });
  it('Calls the original functionwith any quantity of arguments', done => {
    unpromisify((...args) =>
      Promise.reject(args.reduce((sum, item) => sum + item))
    )(10, 20, 30, 40, (err, data) => (err === 100 ? done() : 0));
  });
  it('Gets a result of rejected Promise and handles it in the callback', done => {
    unpromisify(arg => Promise.reject(arg))(
      'error',
      (err, data) => (err === 'error' ? done() : 0)
    );
  });
  it('Gets a result of resolved Promise and handles it in the callback', done => {
    unpromisify(arg => Promise.resolve(arg))(
      'data',
      (err, data) => (!err && data === 'data' ? done() : 0)
    );
  });
});
