/**
 * data/index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = data;
// istanbul ignore next

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _model = require('./model');

var Model = _interopRequireWildcard(_model);

var _source = require('./source');

var Source = _interopRequireWildcard(_source);

/*!
 * Ignis extension
 */

function data(Ignis) {
  Ignis.prototype.model = Model.model;
  Ignis.prototype.source = Source.source;

  Ignis.init(function () {
    this[Model.__models] = new Map();
    this[Source.__sources] = new Map();
  });
}

module.exports = exports['default'];
//# sourceMappingURL=../data/index.js.map