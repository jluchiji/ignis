/**
 * config/envar.js
 *
 * @author  Denis-Luchkin-Zhou
 * @license MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = env;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var debug = (0, _debug2['default'])('ignis:config:envar');

/**
 * env(1)
 *
 * @description                Import specified environment variables into the
 *                             Ignis config.
 * @param          {fields}    Object whose keys are envar names, and values
 *                             are string descriptions of the parameter.
 */

function env(fields) {
  // istanbul ignore next

  var _this = this;

  Object.keys(fields).forEach(function (key) {
    if (typeof process.env[key] === 'undefined') {
      debug(_chalk2['default'].red('[missing]') + ' ' + key);
      _this.emit('config.missing', { name: key, description: fields[key] });
    } else {
      _this.config('env.' + key, process.env[key]);
    }
  });
}

module.exports = exports['default'];
//# sourceMappingURL=../config/envar.js.map