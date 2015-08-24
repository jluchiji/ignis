/**
 * ignis.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Bluebird    from 'bluebird';
import Monologue   from 'monologue.js';
import { exts }    from './util/symbols';


/*!
 * Ignis root namespace object.
 */
const Ignis = new Monologue(); export default Ignis;


/*!
 * Ignis application middleware hooks / factories.
 */
Ignis.middleware = [ ];  // These are directly attached to the root router
Ignis.factories  = [ ];  // These are instantiated for every mount operation


/**
 * waitFor(1)
 *
 * @access         public
 * @description                Makes Ignis wait for the promise before starting.
 * @param          {promise}   Promise to wait for.
 * @returns        {Ignis}     Ignis instance for further chaining.
 */
Ignis.wait = function(promise) {
  this.wait.__promises.push(promise);
  return this;
};
Ignis.wait.__promises = [ ];


/**
 * ready(1)
 *
 * @access         public
 * @description                Calls the callback when all promises are clear.
 * @param          {callback}  Callback function.
 * @returns        {Ignis}     Ignis instance for further chaining.
 */
Ignis.ready = function(callback) {
  Bluebird
    .all(this.wait.__promises)
    .then(() => {
      this.emit('started');
      callback(this);
    })
    .catch((error) => {
      this.emit('error', error);
      throw error;
    })
    .done();

  return this;
};


/**
 * use(1)
 *
 * @access         public
 * @description                Make Ignis use the extension.
 * @param          {fn}        Function exported by the extension module.
 * @returns        {Ignis}     Ignis class for further chaining.
 */
Ignis.use = function(fn) {
  if (typeof fn === 'object' && typeof fn.default === 'function') {
    fn = fn.default;
  }
  if (!this.use.__extensions.has(fn)) {
    this.use.__extensions.add(fn);
    fn(this);
  }
  return this;
};
Ignis.use.__extensions = new Set();

/*!
 * Ignis root functions.
 */
Ignis.use(require('./error'));
Ignis.use(require('./config'));
Ignis.use(require('./config/envar'));
Ignis.use(require('./data/model'));
Ignis.use(require('./data/source'));


/* Passport.js authentication strategies */
Ignis.use(require('./auth'));
