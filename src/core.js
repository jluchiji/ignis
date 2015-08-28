/**
 * core.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import Debug       from 'debug';
import Express     from 'express';
import Bluebird    from 'bluebird';
import Monologue   from 'monologue.js';

const debug = Debug('ignis:core');

/**
 * IgnisApp
 *
 * @description Ignis application class.
 */
export default class Ignis extends Monologue {

  constructor() {
    super();

    /* Ignis application middleware management */
    this.factories  = [ ];

    /* Startup sequence root promise */
    this.startup    = Bluebird.resolve();

    /* Root express router */
    this.root       = Express();

    /* Run all initializers on this */
    Ignis.init.forEach(fn => fn.call(this));
  }

  /**
   * wait(1)
   *
   * @access         public
   * @description                Makes Ignis wait for the promise before starting.
   * @param          {action}    Function to call and wait for.
   * @returns        {Ignis}     Ignis instance for further chaining.
   */
  wait(action) {
    debug(`Ignis::wait()`);
    if (typeof action === 'function') {
      this.startup = this.startup.then(i => action.call(this, this.root));
    } else {
      throw new Error('Cannot wait on non-function objects.');
    }
    return this;
  }


  /**
   * listen(1)
   *
   * @description                Creates an Express.js application, mounts the
   *                             root router and listens for connections on the
   *                             specified port.
   * @param          {port}      [Optional] Port to listen on (default: PORT)
   * @returns        {promise}   Rejects when an error occurs.
   */
  listen(port) {
    debug('Ignis::listen()');
    if (typeof port !== 'number') { port = Number(process.env.PORT); }
    this.wait(i =>
      Bluebird.fromNode((done) => {
        this.root.listen(port, done);
      })
      .tap(i => debug('Ignis::listen(): Ignis up and ready'))
    );
    return this.startup;
  }


  /**
   * use(1)
   *
   * @access         public
   * @description                Make Ignis use the extension.
   * @param          {fn}        Function exported by the extension module.
   * @returns        {Ignis}     Ignis class for further chaining.
   */
  use(fn) { Ignis.use.call(this, fn); }

}


/*!
 * Initializers: these are called every time an Ignis instance is created.
 */
Object.defineProperty(Ignis, 'init', { value: [] });


/*!
 * Extensions: tracks which extensions are already attached to the Ignis.
 */
Object.defineProperty(Ignis, '__exts', { value: new Set() });


/**
 * use(1)
 *
 * @access         public
 * @description                Make Ignis use the extension.
 * @param          {fn}        Function exported by the extension module.
 * @returns        {Ignis}     Ignis class for further chaining.
 */
Ignis.use = function(fn) {
  /* Handle ES6 modules with multiple exports */
  if (_.isObject(fn) && _.isFunction(fn.default)) { fn = fn.default; }
  /* No-op if this extension is already attached */
  if (Ignis.__exts.has(fn)) { return Ignis; }
  Ignis.__exts.add(fn);
  fn.call(this === Ignis ? null : this, Ignis);
};
