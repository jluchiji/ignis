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
  let store = this.__sources;

  /* If callback is not specified, retrieve the source. */
  if (typeof callback !== 'function') {
    let result = store.get(name);
    if (!result) { throw new Error(`Data source not found: ${name}`); }
    return result;
  }

  /* Otherwise, create the data source */
  this.wait(function() {
    if (store.get(name)) { throw new Error(`Data source exists: ${name}`); }
    debug(`Data source '${name}' not found; connecting...`);

    return Bluebird
      .resolve(callback(...args))
      .then((source) => {
        debug(`Connection to '${name}' successful.`);
        if (!source) {
          throw new Error('Data source callback returned falsy value.');
        }
        store.set(name, source);
        return source;
      });
  });

  return this;
}


/*!
 * Extension
 */
export default function dataSource(ignis) {
  Object.defineProperty(ignis, '__sources', { value: new Map() });
  ignis.source = source;
}
