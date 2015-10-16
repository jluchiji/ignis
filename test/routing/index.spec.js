/**
 * test/routing/mount.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const Ignis          = dofile('lib/core');
const target         = dofile('lib/routing/index');

describe('endpoint(2)', function() {

  beforeEach(function() {
    Ignis.use(target);
    this.ignis = new Ignis();
  });

  it('should mount the extension', function() {
    return this.ignis.startup.then(() => {
      expect(this.ignis.mount).to.be.a('function');
      expect(this.ignis.endpoint).to.be.a('function');
    });
  });

  it('should mount an endpoint', function() {
    const fn = Sinon.spy();
    this.ignis.endpoint('/test', fn);

    return expect(this.ignis.startup).to.be.fulfilled.then(() => {
      expect(fn).to.be.calledOnce.and.to.be.calledWith('/test', this.ignis);
    });
  });

  it('should handle ES6 module required from CommonJS', function() {
    const fn = { __esModule: true, default: Sinon.spy() };
    this.ignis.endpoint('/test', fn);

    return expect(this.ignis.startup).to.be.fulfilled.then(() => {
      expect(fn.default).to.be.calledOnce.and.to.be.calledWith('/test', this.ignis);
    });
  });


  it('should not mount an endpoint that is already mounted', function() {

    const fn = Sinon.spy();
    this.ignis.endpoint('/test', fn);
    this.ignis.endpoint('/test2', fn);

    return expect(this.ignis.startup).to.be.fulfilled.then(() => {
      expect(fn).to.be.calledOnce.and.to.be.calledWith('/test');
    });

  });

});
