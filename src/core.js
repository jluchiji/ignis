/**
 * core.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import Debug       from 'debug';
import Chalk       from 'chalk';
import Express     from 'express';
import Prequire    from 'parent-require';
import Bluebird    from 'bluebird';
import Monologue   from 'monologue.js';

import { symbol }  from 'ignis-util';

const debug = Debug('ignis:core');

/*!
 * Export symbols used by Ignis class.
 */
const init = symbol('Ignis::core::init');
const exts = symbol('Ignis::core::exts');


/*!
 * Global Ignis instance.
 */
let instance = null;


/**
 * IgnisApp
 *
 * @description Ignis application class.
 */
function Ignis(arg) {

  /* Get/set the global instance if this is called as function */
  if (!(this instanceof Ignis)) {
    if (arg === null || arg instanceof Ignis) {
      debug(`${Chalk.red('[replace]')} singleton`);
      instance = arg;
    }
    if (!instance) {
      debug(`${Chalk.green('[create]')} singleton`);
      instance = new Ignis();
    }
    return instance;
  }

  /* Otherwise, this is a class constructor. */
  this[exts]      = new Set();
  this[init]      = new Set();
  this.root       = Express();
  this.startup    = Bluebird.resolve();
  this.factories  = [ ];

  this.init();
}
Ignis.prototype = new Monologue();
export default Ignis;


/**
 * init(0)
 *
 * @description              Runs all initializers that have not been run on
 *                           this Ignis instance.
 */
Ignis.prototype.init = function() {
  Ignis[init].forEach(fn => {
    if (this[init].has(fn)) { return; }
    this[init].add(fn);
    fn.call(this);
  });
};


/**
 * wait(1)
 *
 * @access         public
 * @description                Makes Ignis wait for the promise before starting.
 * @param          {action}    Function to call and wait for.
 * @returns        {Ignis}     Ignis instance for further chaining.
 */
Ignis.prototype.wait = function(action) {
  if (typeof action === 'function') {
    this.startup = this.startup.then(() => action.call(this, this.root));
  } else {
    throw new Error('Cannot wait on non-function objects.');
  }
  return this;
};


/**
 * listen(1)
 *
 * @description                Creates an Express.js application, mounts the
 *                             root router and listens for connections on the
 *                             specified port.
 * @param          {port}      [Optional] Port to listen on (default: PORT)
 * @returns        {promise}   Rejects when an error occurs.
 */
Ignis.prototype.listen = function(port) {
  debug(`${Chalk.yellow('[call]')} Ignis::listen()`);
  if (typeof port !== 'number') { port = Number(process.env.PORT); }
  this.wait(() =>
    Bluebird.fromNode((done) => {
      this.root.listen(port, done);
    })
    .tap(() => debug(`${Chalk.cyan('[success]')} Ignis::listen()`))
  );
  return this.startup;
};


/**
 * use(1)
 *
 * @access         public
 * @description                Make Ignis use the extension.
 * @param          {fn}        Function exported by the extension module.
 * @returns        {Ignis}     Ignis class for further chaining.
 */
Ignis.prototype.use = function(fn, ...args) {
  /* If fn is a string, load it first */
  if (typeof fn === 'string') { fn = Prequire(fn); }
  /* Handle ES6 modules with multiple exports */
  if (fn.__esModule) { fn = fn.default; }
  /* Do nothing if the extension was already used */
  if (this[exts].has(fn)) { return this; }
  this[exts].add(fn);

  /* Wait for startup queue to clear, then use the extension */
  this.wait(() => {
    fn(this, ...args);
  });
  return this;
};


/**
 * env(1)
 *
 * @access         public
 * @description                Checks NODE_ENV against a value.
 * @param          {name}      RegExp or string describing environment.
 * @returns        {bool}      True if environment matches.
 */
Ignis.prototype.env = function(name) {
  const env = process.env.NODE_ENV;
  if (name instanceof RegExp) { return name.test(env); }
  return name === env;
};


/*!
 * Initializers: these are called every time an Ignis instance is created.
 */
Ignis[init] = [ ];


/*!
 * Extensions: tracks which extensions are already attached to the Ignis.
 */
Ignis[exts] = new Set();


/**
 * init(1)
 *
 * @description                Pushes the initializer callback into the Ignis
 *                             initializer stack.
 * @param          {fn}        Initializer function to push.
 */
Ignis.init = function(fn) {
  Ignis[init].push(fn);
};


/**
 * use(1)
 *
 * @access         public
 * @description                Make Ignis use the extension.
 * @param          {fn}        Function exported by the extension module.
 * @returns        {Ignis}     Ignis class for further chaining.
 */
Ignis.use = function(fn, ...args) {
  /* If fn is a string, load it first */
  if (_.isString(fn)) { fn = Prequire(fn); }
  /* Handle ES6 modules with multiple exports */
  if (fn.__esModule) { fn = fn.default; }
  /* No-op if this extension is already attached */
  if (Ignis[exts].has(fn)) { return Ignis; }
  Ignis[exts].add(fn);
  fn(Ignis, ...args);
  if (this !== Ignis) { this.init(); }
};
