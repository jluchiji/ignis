/**
 * test/service.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const Service = dofile('lib/service');

describe('Ignis.Service', function() {

  beforeEach(function() {
    this.derived = function TestService() { };
    this.derived.prototype = new Service(this.ignis);
  });

  it('should create Service instance', function() {
    const actual = new Service(this.ignis);

    expect(actual)
      .to.exist
      .to.be.instanceOf(Service);

    return actual.init();
  });

  describe('meta(key, value)', function() {

    it('should set meta value', function() {
      Service.meta(this.derived, 'foo', 'bar');
      Service.meta(this.derived, 'hello', 'world');

      expect(this.derived[Service.$$metadata])
        .to.have.a.property('foo', 'bar');
    });

    it('should get meta value', function() {
      this.derived[Service.$$metadata] = { foo: 'bar' };

      const actual = Service.meta(this.derived, 'foo');

      expect(actual)
        .to.equal('bar');
    });

    it('should return null when Service has no metadata', function() {
      const actual = Service.meta(this.derived, 'foo');
      expect(actual)
        .to.be.null;
    });

  });

  describe('deps(...deps)', function() {

    it('should attach deps info to Service', function() {

      Service.deps('foo', 'bar')(this.derived);

      const actual = Service.meta(this.derived, 'deps');

      expect(actual)
        .to.deep.equal(['foo', 'bar']);

    });

  });

});
