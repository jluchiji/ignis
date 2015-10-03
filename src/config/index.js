/**
 * config/index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import Debug       from 'debug';
import Chalk       from 'chalk';
import * as Util   from 'ignis-util';

import File        from './file';
import Envar       from './envar';

const debug = Debug('ignis:config');

/*!
 * Export symbols used by config(2).
 */
const __store = Util.symbol('Ignis::config::store');

/*!
 * Regex for envar substitutions.
 */
const substPattern = /^\$[A-Z0-9_]+$/;


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
  const store = this[__store];
  const old = _.get(store, name);

  /* Get config value if available */
  if (typeof value === 'undefined') {
    /* Always check that config exists */
    if (typeof old === 'undefined') {
      throw new Error(`Config option '${name}' is not defined.`);
    }
    return old;
  }

  /* Substitute envars as specified */
  Util.deepForEach(value, (v, k, o) => {
    if (typeof v === 'string' && substPattern.test(v)) {
      const key = v.substring(1);
      const envar = process.env[key];
      debug(`subst ${key}`);
      if (!envar) { throw new Error(`Missing envar: ${key}`); }
      o[k] = envar;
    }
  });

  /* Otherwise, set the config value */
  _.set(store, name, value);
  const ev = (typeof old === 'undefined') ? 'set' : 'modified';
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
