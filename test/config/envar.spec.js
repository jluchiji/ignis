/**
 * test/config/enconst.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const Ignis  = dofile('lib/core');
const envar  = dofile('lib/config');

describe('env(1)', function() {

  beforeEach(function() {
    Ignis.use(envar);
    this.ignis = new Ignis();

    const env = this.ignis.config.env;
    this.ignis.config = Sinon.spy(this.ignis.config);
    this.ignis.config.env = env.bind(this.ignis);
    this.ignis.emit = Sinon.spy(this.ignis.emit);

    return this.ignis.startup;
  });

  it('should add specified environment constiables to config', function() {
    process.env.FOO = 'bar';
    this.ignis.config.env({ 'FOO': 'Test constiable 1.'});
    expect(this.ignis.config)
      .to.be.calledOnce.and
      .to.be.calledWith('env.FOO', 'bar');
  });

  it('should emit \'config.missing\' when a enconst is undefiend', function() {
    this.ignis.config.env({ 'NO-SUCH-const': 'Test constiable 2.'});
    expect(this.ignis.emit)
      .to.be.calledOnce.and
      .to.be.calledWith('config.missing');
    expect(this.ignis.emit.firstCall.args[1]).to.deep.equal({
      name: 'NO-SUCH-const',
      description: 'Test constiable 2.'
    });
  });

});
