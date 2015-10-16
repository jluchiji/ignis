/**
 * test/data/index.spec.js
 *
 * @author  Denis-Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

const Data           = dofile('lib/data');
const Ignis          = dofile('lib/core');


describe('extension', function() {

  it('should mount the extension', function() {
    Ignis.use(Data);
    const ignis = new Ignis();

    return ignis.startup.then(() => {
      expect(ignis.source).to.be.a('function');
      expect(ignis.model).to.be.a('function');
    });

  });

});
