/**
 * test/services/http.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */


const Express = require('express');
const Ignis = dofile('./lib/core');
const HttpService = dofile('./lib/services/http');

describe('Ignis.HttpService', function() {

  it('should create Ignis.HttpService instances', function() {
    const actual = new HttpService(this.ignis);

    expect(actual)
      .to.be.instanceof(HttpService);
  });

  beforeEach(function() {
    this.ignis = new Ignis();
    this.ignis.init = Sinon.spy(this.ignis.init);
    this.http = new HttpService(this.ignis);
  });

  describe('postinit', function() {

    it('should attach shortcuts to Ignis root', function() {
      this.http.postinit();

      expect(this.ignis)
        .to.have.property('mount')
        .that.is.a('function');
      expect(this.ignis)
        .to.have.property('error')
        .that.is.a('function');
    });

  });

  describe('pre(factory)', function() {

    it('should push a pre-callback factory', function() {
      const callback = function() { };
      this.http.pre(callback);

      const actual = this.http[HttpService.$$pre];
      expect(actual)
        .to.have.length(1);
      expect(actual[0])
        .to.equal(callback);
    });

  });

  describe('post(factory)', function() {

    it('should push a post-callback factory', function() {
      const callback = function() { };
      this.http.post(callback);

      const actual = this.http[HttpService.$$post];
      expect(actual)
        .to.have.length(1);
      expect(actual[0])
        .to.equal(callback);
    });

  });

  describe('mount(path, meta)', function() {

    beforeEach(function() {
      this.pre = function pre() { };
      this.post = function post() { };

      this.http.pre(() => this.pre);
      this.http.post(() => this.post);
    });

    it('should mount a middleware stack', function() {
      this.http.router.post = Sinon.spy();

      const endpoint = function endp() { };
      endpoint.path = 'POST /foo/bar';

      this.http.mount('/test', endpoint);

      expect(this.http.router.post)
        .to.be.calledOnce;

      const args = this.http.router.post.firstCall.args;
      expect(args[0])
        .to.equal('/test/foo/bar');
      expect(args[1])
        .to.equal(this.pre);
      expect(args[2])
        .to.be.a('function');
      expect(args[3])
        .to.equal(this.post);
    });

    it('should unwrap ES6 modules', function() {
      this.http.router.post = Sinon.spy();

      const endpoint = {
        path: 'POST /bar/baz',
        handler: function() { }
      };

      this.http.mount('/test', { __esModule: true, default: endpoint });

      expect(this.http.router.post)
        .to.be.calledOnce;

      const args = this.http.router.post.firstCall.args;
      expect(args[0])
        .to.equal('/test/bar/baz');
      expect(args[1])
        .to.equal(this.pre);
      expect(args[2])
        .to.be.a('function');
      expect(args[3])
        .to.equal(this.post);
    });

    it('should fail when handler is not function', function() {
      expect(() => {
        this.http.mount('/', { });
      }).to.throw('Expected handler to be a function but got');
    });

    it('should fail when mount path is empty', function() {
      expect(() => {
        this.http.mount('/', { handler: function() { }, path: '' });
      }).to.throw('');
    });

    it('should fail when mount path is invalid', function() {
      expect(() => {
        this.http.mount('/', { handler: function() { }, path: '/test' });
      }).to.throw('Invalid mount path');
    });

    it('should fail when HTTP verb is not supported', function() {
      expect(() =>
        this.http.mount('/', { handler: () => { }, path: 'NOPE /hello' })
      ).to.throw('HTTP verb not supported: NOPE');
    });

  });

  describe('error(guard, callback)', function() {

    it('should attach an error handler', function() {
      this.http.router.use = Sinon.spy();

      const callback = Sinon.spy();
      this.http.error('TestError', callback);

      expect(this.http.router.use)
        .to.be.calledOnce;

      const handler = this.http.router.use.firstCall.args[0];
      expect(handler)
        .to.exist
        .to.be.a('function');

      const err = new Error();
      err.name = 'TestError';
      handler(err, null, null, null);

      expect(callback)
        .to.be.calledOnce
        .to.be.calledWith(err, null, null, null);

      const err2 = new Error();
      const next = Sinon.spy();
      handler(err2, null, null, next);
      expect(next)
        .to.be.calledOnce
        .to.be.calledWith(err2);

    });

  });

  describe('listen(port)', function() {

    before(function() {
      HttpService._listen = HttpService.listen;
      Express.application._listen = Express.application.listen;
    });

    beforeEach(function() {
      HttpService.listen = Sinon.spy(HttpService._listen);
      Express.application.listen = Sinon.spy((port, done) => done());
    });

    after(function() {
      HttpService.listen = HttpService._listen;
      delete HttpService._listen;
      Express.application.listen = Express.application._listen;
      delete Express.application._listen;
    });

    it('should call the express app.listen() with port', co(function*() {

      this.ignis.use(HttpService);
      yield this.ignis.init();

      yield this.ignis.listen(3000);

      expect(this.ignis.init)
        .to.be.calledOnce;

      expect(Express.application.listen)
        .to.be.calledOnce
        .to.be.calledWith(3000);

    }));

    it('should initialize application', co(function*() {

      this.ignis.use(HttpService);
      yield this.ignis.listen(3000);

      expect(this.ignis.init)
        .to.be.calledOnce;

      expect(Express.application.listen)
        .to.be.calledOnce
        .to.be.calledWith(3000);
    }));

  });

});
