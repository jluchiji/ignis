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

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

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
    if (arg === null || arg instanceof Ignis) {
      debug(_chalk2['default'].red('[replace]') + ' singleton');
      instance = arg;
    }
    if (!instance) {
      debug(_chalk2['default'].green('[create]') + ' singleton');
      instance = new Ignis();
    }
    return instance;
  }

  /* Otherwise, this is a class constructor. */
  this[exts] = new Set();
  this[init] = new Set();
  this.root = (0, _express2['default'])();
  this.startup = _bluebird2['default'].resolve();
  this.pre = [];
  this.post = [];

  /* Compatibility with ignis 0.1.x */
  this.factories = this.pre;

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

  if (typeof action === 'function') {
    this.startup = this.startup.then(function () {
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

  debug(_chalk2['default'].yellow('[call]') + ' Ignis::listen()');
  if (typeof port !== 'number') {
    port = Number(process.env.PORT);
  }
  this.wait(function () {
    return _bluebird2['default'].fromNode(function (done) {
      _this3.root.listen(port, done);
    }).tap(function () {
      return debug(_chalk2['default'].cyan('[success]') + ' Ignis::listen()');
    });
  });
  return this.startup;
};

/**
 * load(1)
 *
 * @access         public
 * @description                Make Ignis use the extension.
 * @param          {fn}        Function exported by the extension module.
 * @returns        {Ignis}     Ignis class for further chaining.
 */
Ignis.prototype.load = function (fn) {
  // istanbul ignore next

  var _this4 = this;

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  /* If fn is a string, load it first */
  if (typeof fn === 'string') {
    fn = (0, _parentRequire2['default'])(fn);
  }
  /* Handle ES6 modules with multiple exports */
  if (fn.__esModule) {
    fn = fn['default'];
  }
  /* Do nothing if the extension was already used */
  if (this[exts].has(fn)) {
    return this;
  }
  this[exts].add(fn);

  /* Wait for startup queue to clear, then use the extension */
  this.wait(function () {
    fn.apply(undefined, [_this4].concat(args));
  });
  return this;
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
  /* If fn is a string, load it first */
  if (typeof fn === 'string') {
    fn = (0, _parentRequire2['default'])(fn);
  }
  /* Handle ES6 modules with multiple exports */
  if (fn.__esModule) {
    fn = fn['default'];
  }
  /* Do nothing if the extension was already used */
  if (this[exts].has(fn)) {
    return this;
  }
  this[exts].add(fn);

  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  fn.apply(undefined, [this].concat(args));
  return this;
};

/**
 * env(1)
 *
 * @access         public
 * @description                Checks NODE_ENV against a value.
 * @param          {name}      RegExp or string describing environment.
 * @returns        {bool}      True if environment matches.
 */
Ignis.prototype.env = function (name) {
  var env = process.env.NODE_ENV;
  if (name instanceof RegExp) {
    return name.test(env);
  }
  return name === env;
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
  if (fn.__esModule) {
    fn = fn['default'];
  }
  /* No-op if this extension is already attached */
  if (Ignis[exts].has(fn)) {
    return Ignis;
  }
  Ignis[exts].add(fn);

  for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  fn.apply(undefined, [Ignis].concat(args));
  if (this !== Ignis) {
    this.init();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=core.js.map