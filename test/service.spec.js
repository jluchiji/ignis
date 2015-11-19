/**
 * test/service.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const Ignis   = dofile('lib/core');
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

  describe('get base()', function() {

    beforeEach(function() {
      this.instance = new this.derived(this.ignis);
      this.instance[Ignis.$$base] = this.derived;
    });

    it('should get the base service class', function() {
      const actual = this.instance.base;

      expect(actual)
        .to.equal(this.derived);
    });

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

  describe('@deps(...deps)', function() {

    it('should attach deps info to Service', function() {

      Service.deps('foo', 'bar')(this.derived);

      const actual = Service.meta(this.derived, 'deps');

      expect(actual)
        .to.deep.equal(['foo', 'bar']);

    });

  });

  describe('@abstract', function() {

    it('should mark a service as abstract', function() {

      Service.abstract(this.derived);

      const actual = Service.meta(this.derived, 'abstract');

      expect(actual)
        .to.be.true;

    });

  });

  describe('@export(options)', function() {

    it('should add member to export list', function() {

      Service.export()(this.derived, 'foo');

      const actual = Service.meta(this.derived, 'exports');

      expect(actual)
        .to.have.property('foo')
        .that.deep.equals({ enumerable: true, readonly: false });

    });

    it('should throw when called on non-static member', function() {
      const instance = new this.derived(this.ignis);
      instance.hello = 'world';

      expect(() => {
        Service.export()(instance, 'hello');
      }).to.throw('@export must be called on static Ignis.Service members');

    });

    it('should fail when atempting to perform duplicate export', function() {

      Service.export()(this.derived, 'foo');
      expect(() => {
        Service.export()(this.derived, 'foo');
      }).to.throw('Duplicate export: foo');

    });

  });

});
