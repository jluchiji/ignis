/**
 * test/data/source.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
const Ignis          = dofile('lib/core');
const Data           = dofile('lib/data');


describe('source(1)', function() {

  beforeEach(function() {
    Ignis.use(Data);
    this.ignis = new Ignis();
  });

  it('should provide calling Ignis instance as argument', function() {
    this.ignis.source('test', i => expect(i).to.equal(this.ignis));
    expect(this.ignis.startup).to.be.fulfilled;
  });

  it('should connect if sync callback succeeds', function() {

    const fake = { test: 0 };
    this.ignis.source('test', () => fake);

    expect(this.ignis.startup).be.fulfilled.then(() => {
      expect(this.ignis.source('test')).to.equal(fake);
    });

  });

  it('should connect if async callback succeeds', function() {

    const fake = { test: 1 };
    this.ignis.source('test', () => {
      return Bluebird.resolve(fake);
    });

    expect(this.ignis.startup).be.fulfilled.then(() => {
      expect(this.ignis.source('test')).to.equal(fake);
    });

  });

  it('should reject if sync callback fails', function() {
    this.ignis.source('test', function() {
      throw new Error('Test Error');
    });

    expect(this.ignis.startup).to.be.rejectedWith('Test Error');
  });

  it('should reject if async callback fails', function() {
    this.ignis.source('test', function() {
      return Bluebird.reject(new Error('Test Error'));
    });

    expect(this.ignis.startup).to.be.rejectedWith('Test Error');
  });

  it('should reject on attempt to overwrite the connection', function() {
    const fake = { test: 4 };
    this.ignis.source('test', function() { return fake; });
    expect(this.ignis.startup).be.fulfilled.then(() => {
      this.ignis.source('test', () => { return { test: 5 }; });
      expect(this.ignis.startup).to.be.rejectedWith('Data source exists: test');
    });
  });

  it('should correctly pass parameters to the callback', function() {

    const fake = { foo: 'bar' };
    this.ignis.source('test', (i, a, b) => {
      expect(i).to.equal(this.ignis);
      expect(a).to.equal(0);
      expect(b).to.equal(1);
      return fake;
    }, 0, 1);

    expect(this.ignis.startup).to.be.fulfilled;

  });

  it('should reject if callback returns a falsy value', function() {

    this.ignis.source('test', function() { return null; });
    expect(this.ignis.startup).to.be
      .rejectedWith('Data source callback returned falsy value.');

  });

  it('should throw if data source is not found', function() {
    expect(() => {
      this.ignis.source('no-such-source');
    }).to.throw('Data source not found: no-such-source');
  });

});
