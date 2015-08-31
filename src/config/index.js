/**
 * config/index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import Debug       from 'debug';
import Chalk       from 'chalk';
import { symbol }  from 'ignis-util';

import File        from './file';
import Envar       from './envar';

const debug = Debug('ignis:config');

/*!
 * Export symbols used by config(2).
 */
const __store = symbol('Ignis::config::store');

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
  let old = _.get(store, name);

  /* Get config value if available */
  if (typeof value === 'undefined') {
    /* Always check that config exists */
    if (typeof old === 'undefined') {
      throw new Error(`Config option '${name}' is not defined.`);
    }
    return old;
  }

  /* Otherwise, set the config value */
  _.set(store, name, value);
  let ev = (typeof old === 'undefined') ? 'set' : 'modified';
  debug(`${Chalk.yellow('[' + ev + ']')} ${name}`);
  this.emit(
    `config.${ev}`,
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
  this[__store] = Object.create(null);
  this.config = config;
  this.config.env = Envar.bind(this);
  this.config.file = File.bind(this);
}

/*!
 * Ignis.js extension
 */
export default function(Ignis) {
  Ignis.init(init);
}
