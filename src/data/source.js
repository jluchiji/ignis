/**
 * data/source.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Chalk       from 'chalk';
import Debug       from 'debug';
import Bluebird    from 'bluebird';

const  debug     = Debug('ignis:data:source');

/*!
 * Export symbols used by source(1)
 */
export const __sources = Symbol('Ignis::data::sources');


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
  const store = this[__sources];

  /* If callback is not specified, retrieve the source. */
  if (typeof callback !== 'function') {
    const result = store.get(name);
    if (!result) { throw new Error(`Data source not found: ${name}`); }
    return result;
  }

  /* Otherwise, create the data source */
  this.wait(function() {
    if (store.get(name)) { throw new Error(`Data source exists: ${name}`); }
    debug(`${Chalk.yellow('[connecting]')} ${name}`);

    return Bluebird
      .resolve(callback(this, ...args))
      .then(src => {
        debug(`${Chalk.cyan('[success]')} ${name}`);
        if (!src) {
          throw new Error('Data source callback returned falsy value.');
        }
        store.set(name, src);
        return src;
      });
  });

  return this;
}
