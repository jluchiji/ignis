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
 * Ignis root functions.
 */
Ignis.Error        = require('./error');
Ignis.model        = require('./data/model');
Ignis.source       = require('./data/source');


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
  if (!Ignis[exts].has(fn)) {
    Ignis[exts].add(fn);
    fn(Ignis);
  }
  return Ignis;
};
