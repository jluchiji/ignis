/**
 * config/index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.config = config;
exports.init = init;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _ignisUtil = require('ignis-util');

var _file = require('./file');

var _file2 = _interopRequireDefault(_file);

var _envar = require('./envar');

var _envar2 = _interopRequireDefault(_envar);

var debug = (0, _debug2['default'])('ignis:config');

/*!
 * Export symbols used by config(2).
 */
var __store = (0, _ignisUtil.symbol)('Ignis::config::store');

/**
 * config(2)
 *
 * @description                Sets the configuration value if one is provided;
 *                             Otherwise returns the configuration value.
 * @param          {name}      Name of the configuration to get/set.
 * @param          {value}     [Optional] Value of the configuration to set.
 * @returns                    {this} for set; config value for get.
 */

function config(name, value) {
  var store = this[__store];
  var old = _lodash2['default'].get(store, name);

  /* Get config value if available */
  if (typeof value === 'undefined') {
    /* Always check that config exists */
    if (typeof old === 'undefined') {
      throw new Error('Config option \'' + name + '\' is not defined.');
    }
    return old;
  }

  /* Otherwise, set the config value */
  _lodash2['default'].set(store, name, value);
  var ev = typeof old === 'undefined' ? 'set' : 'modified';
  debug(_chalk2['default'].yellow('[' + ev + ']') + ' ' + name);
  this.emit('config.' + ev, {
    name: name,
    oldValue: old,
    newValue: value
  });
  return this;
}

/*!
 * Initializer
 */

function init() {
  this[__store] = Object.create(null);
  this.config = config;
  this.config.env = _envar2['default'].bind(this);
  this.config.file = _file2['default'].bind(this);
}

/*!
 * Ignis.js extension
 */

exports['default'] = function (Ignis) {
  Ignis.init(init);
};
//# sourceMappingURL=../config/index.js.map