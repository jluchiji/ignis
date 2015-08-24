/**
 * data/source.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import Debug       from 'debug';
import Bluebird    from 'bluebird';

const  debug     = Debug('ignis:model');

// Database connection
const  sources   = new Map();

/**
 * source(1)
 *
 * @description                Connects ignis to a data-source.
 * @param          {name}      Name of the data source.
 * @param          {callback}  Callback function, which returns an object
 *                             representing the data connection; or a promise
 *                             that resolves with one.
 * @param          {args}      Arguments to pass to the callback.
 * @returns        {promise}   Promise that resolves if successful.
 */
export function source(name, callback, ...args) {

  /* If callback is not specified, retrieve the source. */
  if (typeof callback !== 'function') {
    let result = sources.get(name);
    if (!result) { throw new Error(`Data source not found: ${name}`); }
    return result;
  }

  /* Otherwise, create the data source */
  let promise =
    Bluebird.try(() => {
      if (sources.get(name)) { throw new Error(`Data source exists: ${name}`); }
      debug(`Data source '${name}' not found; connecting...`);
      return callback(...args);
    })
    .then((source) => {
      debug(`Connection to '${name}' successful.`);
      if (!source) {
        throw new Error('Data source callback returned falsy value.');
      }
      sources.set(name, source);
      return source;
    });

  /* If namespace is present, wait for it to resolve before starting. */
  if (this && typeof this.wait === 'function') { this.wait(promise); }

  return promise;
}


/**
 * source.clear(0)
 *
 * @description                Clears all data connections.
 */
source.clear = function() { sources.clear(); };



/*!
 * Extension
 */
export default function dataSource(ignis) {
  ignis.source = source;
}
