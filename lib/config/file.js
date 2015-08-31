/**
 * config/file.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = file;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _appRootPath = require('app-root-path');

var _appRootPath2 = _interopRequireDefault(_appRootPath);

var debug = (0, _debug2['default'])('ignis:config:file');

/*!
 * Patch require() to handle YAML files.
 */
require('require-yaml');

/**
 * file(1)
 *
 * @description                Loads the given file into Ignis configuration.
 *                             All files are loaded from the parent context.
 *                             Supports json and yaml files.
 * @param          {path}      Path to the config file, relative to the parent
 *                             module root path.
 */

function file(path) {
  var abs = _path2['default'].resolve(_appRootPath2['default'].path, path);
  debug(_chalk2['default'].dim(abs));
  var cfg = require(abs);

  /* Setup configuration */
  var name = _path2['default'].basename(path, _path2['default'].extname(path));
  this.config(name, cfg);
}

module.exports = exports['default'];
//# sourceMappingURL=../config/file.js.map