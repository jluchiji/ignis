/**
 * symbols.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */


/*!
 * Fallback to strings when:
 *   1) Symbols are not supported;
 *   2) In development mode for easier object inspection.
 */
let _symbol = Symbol;
if (!_symbol || /dev/i.test(process.env.NODE_ENV)) {
  _symbol = function(name) { return `@@${name}`; };
}


/*!
 * Tracks active extensions.
 */
export const exts = _symbol('exts');
