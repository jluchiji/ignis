/**
 * data/model.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.model = model;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ignisUtil = require('ignis-util');

/*!
 * Debug logger.
 */
var debug = (0, _debug2['default'])('ignis:data:model');

/*!
 * Export symbols used by model(2)
 */
var __models = (0, _ignisUtil.symbol)('Ignis::data::models');

exports.__models = __models;
/**
 * model(2)
 *
 * @description                Gets/sets a model of the ignis.js
 * @param          {name}      Name of the model.
 * @param          {source}    (optional) Name of the data source.
 * @param          {callback}  (optional) Callback that returns a model object.
 * @returns        {model}     Resulting model object.
 */

function model(name, source, callback) {
  var store = this[__models];

  /* Get the model with the specified name if callback is not specified. */
  if (typeof callback !== 'function') {
    var result = store.get(name);
    if (!result) {
      throw new Error('Model not found: ' + name);
    }
    return result;
  }

  /* Otherwise, create a new model. */
  this.wait(function () {
    // istanbul ignore next

    var _this = this;

    var src = this.source(source);
    if (store.get(name)) {
      throw new Error('Model already exists: ' + name);
    }

    debug(_chalk2['default'].cyan('[success]') + ' ' + name);
    var that = Object.create(null);

    return _bluebird2['default'].resolve(callback.call(that, src)).then(function (result) {
      result = result || that;

      /* Allow models to emit events */
      result.emit = function (event, args) {
        _this.emit('model.' + name + '.' + event, args);
      };

      /* Save the model for later use. */
      store.set(name, result);
    });
  });

  return this;
}
//# sourceMappingURL=../data/model.js.map