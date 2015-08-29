/**
 * routing/index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.endpoint = endpoint;
exports.init = init;
exports['default'] = routingExtension;

var _mount = require('./mount');

var _error = require('./error');

var _ignisUtil = require('ignis-util');

/*!
 * Export symbols used by the mount(2).
 */
var mounted = (0, _ignisUtil.symbol)('Ignis::routing::mounted');

exports.mounted = mounted;
/**
 * endpoint(2)
 *
 * @description                Mounts an endpoint extension to the path.
 * @param          {path}      Path of the endpoint, relative to app root.
 * @param          {fn}        Extension function that mounts middleware.
 * @return         {this}      Namespace for further chaining.
 */

function endpoint(path, fn) {
  this.wait(function () {
    if (!this[mounted].has(fn)) {
      fn(path, this);
      this[mounted].add(fn);
    }
  });

  return this;
}

/*!
 * Initializer.
 */

function init() {
  this[mounted] = new Set();
}

/*!
 * Ignis extension.
 */

function routingExtension(Ignis) {
  Ignis.init(init);
  Ignis.prototype.mount = _mount.mount;
  Ignis.prototype.error = _error.error;
  Ignis.prototype.endpoint = endpoint;
}
//# sourceMappingURL=../routing/index.js.map