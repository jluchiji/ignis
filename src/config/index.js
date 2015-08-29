/**
 * config/index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Debug       from 'debug';
import Envar       from './envar';
import Symbol      from '../util/symbols';

const debug = Debug('ignis:config');

/*!
 * Export symbols used by config(2).
 */
const __store = Symbol('Ignis::config::store');

/**
 * config(2)
 *
 * @description                Sets the configuration value if one is provided;
 *                             Otherwise returns the configuration value.
 * @param          {name}      Name of the configuration to get/set.
 * @param          {value}     [Optional] Value of the configuration to set.
 * @returns                    {this} for set; config value for get.
 */
export function config(name, value) {
  let store = this[__store];
  let old = store.get(name);

  /* Get config value if available */
  if (typeof value === 'undefined') {
    /* Always check that config exists */
    if (typeof old === 'undefined') {
      throw new Error(`Config option '${name}' is not defined.`);
    }
    return old;
  }

  /* Otherwise, set the config value */
  store.set(name, value);
  debug(`Ignis::config(): Modified ${name}`);
  this.emit(
    (typeof old === 'undefined') ? 'config.set' : 'config.modified',
    {
      name:     name,
      oldValue: old,
      newValue: value
    }
  );
  return this;
}


/*!
 * Initializer
 */
export function init() {
  this[__store] = new Map();
  this.config = config;
  this.config.env = Envar.bind(this);
}

/*!
 * Ignis.js extension
 */
export default function(Ignis) {
  Ignis.init(init);
}
