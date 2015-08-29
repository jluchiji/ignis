/**
 * util/symbols.js
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
/* istanbul ignore next */
if (!_symbol || /dev/i.test(process.env.NODE_ENV)) {
  _symbol = function(name) { return `@@${name}`; };
}


/*!
 * Applied initializers.
 */
export const init = _symbol('Ignis::init');


/*!
 * Applied extensions.
 */
export const exts = _symbol('Ignis::exts');
