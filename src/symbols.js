/**
 * symbols.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Debug       from 'debug';
import Bluebird    from 'bluebird';

// Debug logger
const  debug     = Debug('ignis:symbols');

/*!
 * Fallback when:
 *   1) Symbols are not supported;
 *   2) Node environment is 'development'.
 */
let _symbol = Symbol;
/* istanbul ignore if else */
if (!_symbol || process.env.NODE_ENV === 'development') {
  debug('Symbols disabled, falling back to string properties.');
  _symbol = function(name) { return `@@${name}`; };
}


/*!
 * Accesses stored data, such as stored models.
 */
export const store = _symbol('store');
