/**
 * ignis.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Express     from 'express';
import Bluebird    from 'bluebird';
import Monologue   from 'monologue.js';


/**
 * IgnisApp
 *
 * @description Ignis application class.
 */
export class Ignis extends Monologue {

  constructor(name) {
    super();
    this.name       = name || 'ignis-app';

    /* Ignis application middleware management */
    this.factories  = [ ];  // These are instantiated for every endpoint

    /* Promises to wait on */
    this.startup    = [ ];
    this.extensions = new Set();

    /* Root express router */
    this.root       = Express.Router();
  }

  /**
   * wait(1)
   *
   * @access         public
   * @description                Makes Ignis wait for the promise before starting.
   * @param          {promise}   Promise to wait for.
   * @returns        {Ignis}     Ignis instance for further chaining.
   */
  wait(promise) {
    this.startup.push(promise);
    return this;
  }


  /**
   * ready(1)
   *
   * @access         public
   * @description                Calls the callback when all promises are clear.
   * @param          {callback}  Callback function.
   * @returns        {promise}   Rejects when an error occurs.
   */
  ready(callback) {
    return Bluebird
      .all(this.startup)
      .then(() => {
        this.emit('started');
        callback(this);
      });
  }


  /**
   * use(1)
   *
   * @access         public
   * @description                Make Ignis use the extension.
   * @param          {fn}        Function exported by the extension module.
   * @returns        {Ignis}     Ignis class for further chaining.
   */
  use(fn) {
    if (typeof fn === 'object' && typeof fn.default === 'function') {
      fn = fn.default;
    }
    if (!this.extensions.has(fn)) {
      this.extensions.add(fn);
      fn(this);
    }
    return this;
  }

}


/*!
 * Ignis root namespace object.
 */
const instance = new Ignis();
export default instance;
