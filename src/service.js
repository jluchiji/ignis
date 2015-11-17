/**
 * service.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

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


}


/**
 * Expose symbols.
 */
Service.$$metadata = $$metadata;
