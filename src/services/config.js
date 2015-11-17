/**
 * services/config.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import Path        from 'path';
import Debug       from 'debug';
import Chalk       from 'chalk';
import Walker      from 'walker';
import AppRoot     from 'app-root-path';
import Bluebird    from 'bluebird';
import Service     from '../service';
import deepForEach from '../util/deep-for-each';

const debug = Debug('ignis:config');


/* Symbol to hide config data */
const $$data = Symbol();


/* Regex for envar substitutions. */
const substPattern = /^\$[A-Z0-9_]+$/;


/**
 * ConfigService class.
 * Configuration manager.
 */
export default class ConfigService extends Service {


  constructor(ignis) {
    super(ignis);

    /* Config prefix */
    /* istanbul ignore next */
    const configPrefix = process.env.CONFIG_PREFIX || 'config';

    this[$$data] = { };
    this.root = Path.join(AppRoot.toString(), configPrefix);
  }

  /**
   * Initialize.
   * Loads all files in $APP_ROOT_PATH/config directory.
   */
  init() {
    return new Bluebird((resolve, reject) => {
      Walker(this.root)
        .on('file', i => this.file(i))
        .on('error', reject)
        .on('end', () => resolve());
    }).catch(error => {
      debug(Chalk.bold.red('fail ') + error.message);
    });
  }


  /**
   * Attaches shortcut methods to Ignis root.
   */
  postinit() {

    const get = this.get;
    this.ignis.config = this::get;

  }

  /**
   * Loads the config file.
   * Removes the prefix when setting value.
   */
  file(path) {

    /* Determine the path of the config value */
    let name = Path.relative(this.root, path);
    const ext  = Path.extname(name);
    name = name
      .substr(0, name.length - ext.length)
      .replace('.', '_')
      .replace('/', '.');
    debug(Chalk.bold.magenta('file') + ` ${name}`);

    /* Require the file */
    const contents = require(path);
    this.set(name, contents);
  }


  /**
   * Sets a configuration value.
   * Supports deep indexing and envar substitution.
   */
  set(key, value) {
    const store = this[$$data];
    const old = _.get(store, key);

    /* Substitute envars as specified */
    deepForEach(value, (v, k, o) => {
      if (typeof v === 'string' && substPattern.test(v)) {
        const name = v.substring(1);
        const envar = process.env[name];
        debug(Chalk.bold.cyan('substitute') + ` ${name}`);
        if (!envar) { throw new Error(`Missing envar: ${name}`); }
        o[k] = envar;
      }
    });

    /* Otherwise, set the config value */
    _.set(store, key, value);
    const ev = (typeof old === 'undefined') ? 'set' : 'modified';
    debug(Chalk.bold.yellow(ev) + ` ${key}`);
    this.emit(
      `config.${ev}`,
      {
        key:      key,
        oldValue: old,
        newValue: value
      }
    );

    return this;
  }


  /**
   * Gets a configuration value.
   * Supports deep indexing.
   */
  get(key, optional = false) {
    const store = this[$$data];
    const value = _.get(store, key);

    /* Panic if config is required but missing */
    if (typeof value === 'undefined' && !optional) {
      throw new Error(`Config option '${key}' is not defined.`);
    }

    return value;
  }


}


/**
 * Expose symbols
 */
ConfigService.$$data = $$data;
