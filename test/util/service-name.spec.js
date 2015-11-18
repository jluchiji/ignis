/**
 * test/util/service-name.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const Service = dofile('./lib/service');

const ServiceName = dofile('./lib/util/service-name');


describe('serviceName(service)', function() {

  it('should normalize name of a Service', function() {
    const derived = function FooBarService() { };
    derived.prototype = new Service(this.ignis);

    const actual = ServiceName(derived);

    expect(actual)
      .to.equal('foo-bar');
  });

});
