/**
 * routing/mount.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
// istanbul ignore next

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.mount = mount;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _ignisUtil = require('ignis-util');

var debug = (0, _debug2['default'])('ignis:mount');

var styles = {
  get: _chalk2['default'].bold.blue('GET   '),
  put: _chalk2['default'].bold.yellow('PUT   '),
  post: _chalk2['default'].bold.green('POST  '),
  'delete': _chalk2['default'].bold.red('DELETE')
};

/**
 * mount(2)
 *
 * @param          {path}      Root path of the handler to mount.
 * @param          {meta}      Ignis.js request handler with metadata.
 * @return         {this}      Namespace for further chaining.
 */

function mount(path, meta) {
  // istanbul ignore next

  var _this = this;

  if (meta.__esModule) {
    meta = meta['default'];
  }

  var status = meta.status || 200;
  var handler = meta.handler;

  /* Generate the middleware stack */
  var pre = _lodash2['default'].chain(this.pre).map(function (factory) {
    return factory(_this, meta);
  }).compact().value();
  var post = _lodash2['default'].chain(this.post).map(function (factory) {
    return factory(_this, meta);
  }).compact().value();

  /* Push the handler into the middleware stack */
  if (typeof handler !== 'function') {
    throw new Error('Expected handler to be a function but got ' + typeof handler);
  }
  var callback = (0, _ignisUtil.expressify)(handler, this, status);
  var middleware = Array.prototype.concat(pre, callback, post);

  /* Mount the middleware stack to the root router */
  var router = this.root;

  /* Split out the HTTP verb and URL. */
  if (!meta.path || meta.path.length === 0) {
    throw new Error('Mount path is missing or empty.');
  }
  meta.path = _lodash2['default'].flatten([meta.path]);
  meta.path.forEach(function (uri) {
    var _uri$split = uri.split(' ', 2);

    var _uri$split2 = _slicedToArray(_uri$split, 2);

    var verb = _uri$split2[0];
    var url = _uri$split2[1];
    // eslint-disable-line prefer-const
    if (!verb || !url) {
      throw new Error('Invalid mount path: ' + uri);
    }

    /* Determine where to mount the endpoint */
    url = _lodash2['default'].trimRight(_path2['default'].join(path, url), '/');
    verb = verb.toLowerCase();

    debug((styles[verb] || verb.toUpperCase()) + ' ' + url);

    var method = router[verb];
    if (!method) {
      throw new Error('HTTP verb not supported: ' + verb.toUpperCase());
    }
    method.call.apply(method, [router, url].concat(_toConsumableArray(middleware)));
  });

  return this;
}
//# sourceMappingURL=../routing/mount.js.map