/**
 * core.js
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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _parentRequire = require('parent-require');

var _parentRequire2 = _interopRequireDefault(_parentRequire);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _monologueJs = require('monologue.js');

var _monologueJs2 = _interopRequireDefault(_monologueJs);

var _ignisUtil = require('ignis-util');

var debug = (0, _debug2['default'])('ignis:core');

/*!
 * Export symbols used by Ignis class.
 */
var init = (0, _ignisUtil.symbol)('Ignis::core::init');
var exts = (0, _ignisUtil.symbol)('Ignis::core::exts');

/*!
 * Global Ignis instance.
 */
var instance = null;

/**
 * IgnisApp
 *
 * @description Ignis application class.
 */
function Ignis(arg) {

  /* Get/set the global instance if this is called as function */
  if (!(this instanceof Ignis)) {
    if (arg instanceof Ignis) {
      instance = arg;
    }
    if (!instance) {
      arg = new Ignis();
    }
    return arg;
  }

  /* Otherwise, this is a class constructor. */
  this[init] = new Set();
  this.root = (0, _express2['default'])();
  this.startup = _bluebird2['default'].resolve();
  this.factories = [];

  this.init();
}
Ignis.prototype = new _monologueJs2['default']();
exports['default'] = Ignis;

/**
 * init(0)
 *
 * @description              Runs all initializers that have not been run on
 *                           this Ignis instance.
 */
Ignis.prototype.init = function () {
  // istanbul ignore next

  var _this = this;

  Ignis[init].forEach(function (fn) {
    if (_this[init].has(fn)) {
      return;
    }
    _this[init].add(fn);
    fn.call(_this);
  });
};

/**
 * wait(1)
 *
 * @access         public
 * @description                Makes Ignis wait for the promise before starting.
 * @param          {action}    Function to call and wait for.
 * @returns        {Ignis}     Ignis instance for further chaining.
 */
Ignis.prototype.wait = function (action) {
  // istanbul ignore next

  var _this2 = this;

  debug('Ignis::wait()');
  if (typeof action === 'function') {
    this.startup = this.startup.then(function (i) {
      return action.call(_this2, _this2.root);
    });
  } else {
    throw new Error('Cannot wait on non-function objects.');
  }
  return this;
};

/**
 * listen(1)
 *
 * @description                Creates an Express.js application, mounts the
 *                             root router and listens for connections on the
 *                             specified port.
 * @param          {port}      [Optional] Port to listen on (default: PORT)
 * @returns        {promise}   Rejects when an error occurs.
 */
Ignis.prototype.listen = function (port) {
  // istanbul ignore next

  var _this3 = this;

  debug('Ignis::listen()');
  if (typeof port !== 'number') {
    port = Number(process.env.PORT);
  }
  this.wait(function (i) {
    return _bluebird2['default'].fromNode(function (done) {
      _this3.root.listen(port, done);
    }).tap(function (i) {
      return debug('Ignis::listen(): Ignis up and ready');
    });
  });
  return this.startup;
};

/**
 * use(1)
 *
 * @access         public
 * @description                Make Ignis use the extension.
 * @param          {fn}        Function exported by the extension module.
 * @returns        {Ignis}     Ignis class for further chaining.
 */
Ignis.prototype.use = function (fn) {
  Ignis.use.call(this, fn);
};

/*!
 * Initializers: these are called every time an Ignis instance is created.
 */
Ignis[init] = [];

/*!
 * Extensions: tracks which extensions are already attached to the Ignis.
 */
Ignis[exts] = new Set();

/**
 * init(1)
 *
 * @description                Pushes the initializer callback into the Ignis
 *                             initializer stack.
 * @param          {fn}        Initializer function to push.
 */
Ignis.init = function (fn) {
  Ignis[init].push(fn);
};

/**
 * use(1)
 *
 * @access         public
 * @description                Make Ignis use the extension.
 * @param          {fn}        Function exported by the extension module.
 * @returns        {Ignis}     Ignis class for further chaining.
 */
Ignis.use = function (fn) {
  /* If fn is a string, load it first */
  if (_lodash2['default'].isString(fn)) {
    fn = (0, _parentRequire2['default'])(fn);
  }
  /* Handle ES6 modules with multiple exports */
  if (_lodash2['default'].isObject(fn) && _lodash2['default'].isFunction(fn['default'])) {
    fn = fn['default'];
  }
  /* No-op if this extension is already attached */
  if (Ignis[exts].has(fn)) {
    return Ignis;
  }
  Ignis[exts].add(fn);
  fn(Ignis);
  if (this !== Ignis) {
    this.init();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=core.js.map