/**
 * service.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import Ignis       from './core';


/* Symbol to hide service metadata */
const $$metadata = Symbol();


/**
 * Service class.
 * A single unit of Ignis.js functionality.
 */
export default class Service {

  constructor(ignis) {
    this.ignis = ignis;
    this.ready = false;

    const emit = this.ignis.emit;
    this.emit = this.ignis::emit;
  }

  /**
   * Initializes the service.
   * Acquire resources and connect to network here.
   */
  async init() { }


  /**
   * Called after initialization.
   * Generate shortcuts here.
   */
  postinit() { }


  /**
   * Gets the base class for the service.
   */
  get base() {
    return this[Ignis.$$base];
  }


  /**
   * @static Gets/sets a piece of metadata.
   */
  static meta(target, key, value) {

    /* Retrieve the metadata */
    const dict = target[$$metadata];
    if (typeof value === 'undefined') {
      return dict ? dict[key] : null;
    }

    /* Set the metadata */
    if (!dict) { target[$$metadata] = { }; }
    target[$$metadata][key] = value;
  }


  /**
   * @static (decorator) Specifies dependencies.
   */
  static deps(...deps) {
    return function(target) {
      Service.meta(target, 'deps', deps);
    };
  }


  /**
   * @static (decorator) Exports a static member to Ignis.prototype
   */
  static export(options = { }) {
    return function(target, name) {
      if (!(target.prototype instanceof Service)) {
        throw new Error('@export must be called on static Ignis.Service members');
      }
      const list = Service.meta(target, 'exports') || { };

      /* Disallow duplicate definitions */
      if (list[name]) { throw new Error(`Duplicate export: ${name}`); }

      /* Add options to metadata */
      list[name] = _.defaults(options, {
        static: false,
        readonly: false,
        enumerable: true
      });
      Service.meta(target, 'exports', list);
    };
  }


  /**
   * @static (decorator) Indicates that a service is abstract.
   */
  static abstract(target) {
    Service.meta(target, 'abstract', true);
  }

}


/**
 * Expose symbols.
 */
Service.$$metadata = $$metadata;
