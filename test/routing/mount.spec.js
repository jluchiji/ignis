/**
 * test/routing/mount.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
const Mount          = dofile('lib/routing/mount');

describe('mount(2)', function() {

  beforeEach(function() {
    this.meta = {
      path: 'POST /test/',
      auth: 'token',
      foo: 'bar',
      handler: Sinon.spy(function() { })
    };

    this.ns = {
      pre: [ function(ignis, options) { return options.auth; } ],
      post: [ function(ignis, options) { return options.foo; } ],
      mount: Mount.mount,
      root: { post: Sinon.spy((path, a, b) => { this.ns.handler = b; }) }
    };
  });


  it('should create and mount a middleware stack', function() {
    this.ns.mount('/foo/:bar', this.meta);

    const router = this.ns.root.post;
    expect(router).to.be.calledOnce;
    const args = router.firstCall.args;
    expect(args[0]).to.equal('/foo/:bar/test');
    expect(args[1]).to.equal('token');
    expect(args[2]).to.be.a('function');
    expect(args[3]).to.equal('bar');
  });

  it('should handle endpoint with multiple paths', function() {
    this.meta.path = [ 'POST /test/', 'POST /foo', 'POST /bar' ];
    this.ns.mount('/foo/:bar', this.meta);

    const router = this.ns.root.post;
    expect(router).to.be.calledThrice;
    expect(router).to.be.calledWith('/foo/:bar/test', 'token');
    expect(router).to.be.calledWith('/foo/:bar/foo', 'token');
    expect(router).to.be.calledWith('/foo/:bar/bar', 'token');
    expect(router.firstCall.args[2]).to.be.a('function');
  });

  it('should throw on invalid mount path', function() {
    this.meta.path = 'POST/test';

    expect(function() {
      this.ns.mount('/', this.meta);
    }.bind(this)).to.throw('Invalid mount path: ');
  });

  it('should throw on missing mount path', function() {
    this.meta.path = undefined;

    expect(function() {
      this.ns.mount('/', this.meta);
    }.bind(this)).to.throw('Mount path is missing or empty.');
  });

  it('should throw on empty mount path', function() {
    this.meta.path = [ ];

    expect(function() {
      this.ns.mount('/', this.meta);
    }.bind(this)).to.throw('Mount path is missing or empty.');
  });

  it('should throw on invalid method', function() {
    this.meta.path = 'DOSOMETHING /test';

    expect(function() {
      this.ns.mount('/', this.meta);
    }.bind(this)).to.throw('HTTP verb not supported: ');
  });

  it('should throw on bad handler', function() {
    this.meta.handler = null;

    expect(function() {
      this.ns.mount('/foo/:bar', this.meta);
    }.bind(this)).to.throw('Expected handler to be a function but got');
  });

  it('should handle ES6 module required from CommonJS', function() {
    this.meta = { __esModule: true, default: this.meta };

    this.ns.mount('/foo/:bar', this.meta);

    const router = this.ns.root.post;
    expect(router).to.be.calledOnce;
    expect(router).to.be.calledWith('/foo/:bar/test', 'token');
    expect(router.firstCall.args[2]).to.be.a('function');
  });

  it('should pass in the ignis instance', function(done) {
    this.ns.mount('/foo/:bar', this.meta);
    const req = { };
    const res = { status: () => res, send: () => res };

    this.ns.handler(req, res, err => {
      expect(this.meta.handler)
        .to.be.calledOnce.and
        .to.be.calledWith(this.ns, req);
      done(err);
    });
  });

});
