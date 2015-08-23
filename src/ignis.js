/**
 * ignis.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import { exts }    from './symbols';


/*!
 * Ignis root namespace object.
 */
const Ignis = Object.create(null); export default Ignis;


/*!
 * Ignis application middleware hooks / factories.
 */
Ignis.middleware = [ ];  // These are directly attached to the root router
Ignis.factories  = [ ];  // These are instantiated for every mount operation


/*!
 * Setup a set to track active extensions.
 */
Ignis[exts] = new Set();


/**
 * use(1)
 *
 * @access         public
 * @description    Make Ignis use the extension.
 * @param          {fn}        Function exported by the extension module.
 * @returns        {Ignis}     Ignis class for further chaining.
 */
Ignis.use = function(fn) {
  if (typeof fn === 'object' && typeof fn.default === 'function') {
    fn = fn.default;
  }
  if (!Ignis[exts].has(fn)) {
    Ignis[exts].add(fn);
    fn(Ignis);
  }
  return Ignis;
};


/*!
 * Ignis root functions.
 */
Ignis.use(require('./error'));
Ignis.use(require('./data/model'));
Ignis.use(require('./data/source'));


/* Passport.js authentication strategies */
Ignis.use(require('./auth'));
