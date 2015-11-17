/**
 * test/error.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const IgnisError = dofile('lib/error');


describe('Ignis.Error', function() {

  it('should create an IgnisError object', function() {
    const err = new IgnisError(123, 'test', { foo: 'bar' });

    expect(err)
      .to.be.an.instanceOf(Error);
    expect(err)
      .to.have.property('name', 'IgnisError');
    expect(err)
      .to.have.property('status', 123);
    expect(err)
      .to.have.property('message', 'test');
    expect(err.details)
      .to.deep.equal({ foo: 'bar' });
  });

  it('should add sensitive flag if one is given in details', function() {
    const err = new IgnisError(123, 'test', { sensitive: true });
    expect(err)
      .to.have.property('sensitive', true);
  });

  describe('panic(3)', function() {
    expect(function() { IgnisError.panic(400, 'test'); }).to.throw('test');
  });

  describe('deny(2)', function() {
    expect(function() { IgnisError.deny('test'); }).to.throw('test');
  });

  describe('notFound(2)', function() {
    expect(function() { IgnisError.notFound('test'); }).to.throw('test');
  });

});
