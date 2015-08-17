/**
 * data/source.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Debug       from 'debug';
import Bluebird    from 'bluebird';
import { store }   from '../symbols';

const  debug     = Debug('ignis:model');

// Database connection
var connection = null;

/**
 * source(1)
 *
 * @description                Connects ignis to a data-source.
 * @param          {callback}  Callback function, which returns an object
 *                             representing the data connection; or a promise
 *                             that resolves with one.
 * @param          {args}      Arguments to pass to the callback.
 * @returns        {promise}   Promise that resolves if successful.
 */
export default function source(callback, ...args) {
  return Bluebird.try(() => {
    if (connection) { throw new Error('Data connection already exists.'); }
    debug('No data connection found, connecting..');
    return callback(...args);
  })
  .then((source) => {
    debug('Data connection successful.');
    connection = source;
    return source;
  });
}

/**
 * source.connection(0)
 *
 * @returns        {object}    The data connection object.
 */
source.connection = function() { return connection; };

/**
 * source.disconnect(0)
 *
 * @description                Clears the data connection.
 */
source.disconnect = function() { connection = null; };
