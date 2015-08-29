/**
 * ignis.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

/*!
 * Ignis extension packages.
 */
_core2['default'].use(require('./error'));
_core2['default'].use(require('./config'));
_core2['default'].use(require('./data'));
_core2['default'].use(require('./routing'));

var instance = new _core2['default']();
exports['default'] = instance;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map