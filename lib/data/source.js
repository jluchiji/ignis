/**
 * data/source.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.source = source;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var debug = (0, _debug2['default'])('ignis:data:source');

/*!
 * Export symbols used by source(1)
 */
var __sources = Symbol('Ignis::data::sources');

exports.__sources = __sources;
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

function source(name, callback) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var store = this[__sources];

  /* If callback is not specified, retrieve the source. */
  if (!callback) {
    var result = store.get(name);
    if (!result) {
      throw new Error('Data source not found: ' + name);
    }
    return result;
  }

  if (callback.__esModule) {
    callback = callback['default'];
  }

  /* Otherwise, create the data source */
  this.wait(function () {
    if (store.get(name)) {
      throw new Error('Data source exists: ' + name);
    }
    debug(_chalk2['default'].yellow('[connecting]') + ' ' + name);

    return _bluebird2['default'].resolve(callback.apply(undefined, [this].concat(args))).then(function (src) {
      debug(_chalk2['default'].cyan('[success]') + ' ' + name);
      if (!src) {
        throw new Error('Data source callback returned falsy value.');
      }
      store.set(name, src);
      return src;
    });
  });

  return this;
}
//# sourceMappingURL=../data/source.js.map