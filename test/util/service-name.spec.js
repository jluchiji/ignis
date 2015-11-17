/**
 * test/util/service-name.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const Service = dofile('./lib/service');
const DataSource = dofile('./lib/data-source');

const ServiceName = dofile('./lib/util/service-name');


describe('serviceName(service)', function() {

  it('should normalize name of a Service', function() {
    const derived = function FooBarService() { };
    derived.prototype = new Service(this.ignis);

    const actual = ServiceName(derived);

    expect(actual)
      .to.equal('foo-bar');
  });

  it('should normalize name of a DataSource', function() {
    const derived = function HelloWorldDataSource() { };
    derived.prototype = new DataSource(this.ignis);

    const actual = ServiceName(derived);

    expect(actual)
      .to.equal('data:hello-world');
  });


});
