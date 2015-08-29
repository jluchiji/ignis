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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

// istanbul ignore next

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

// istanbul ignore next

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
var _init = (0, _ignisUtil.symbol)('Ignis::core::init');
var exts = (0, _ignisUtil.symbol)('Ignis::core::exts');

/**
 * IgnisApp
 *
 * @description Ignis application class.
 */

var Ignis = (function (_Monologue) {
  _inherits(Ignis, _Monologue);

  function Ignis() {
    _classCallCheck(this, Ignis);

    _get(Object.getPrototypeOf(Ignis.prototype), 'constructor', this).call(this);

    /* Set to keep track of applied initializers */
    this[_init] = new Set();

    /* Ignis application middleware management */
    this.factories = [];

    /* Startup sequence root promise */
    this.startup = _bluebird2['default'].resolve();

    /* Root express router */
    this.root = (0, _express2['default'])();

    this.init();
  }

  /*!
   * Initializers: these are called every time an Ignis instance is created.
   */

  /**
   * init(0)
   *
   * @description              Runs all initializers that have not been run on
   *                           this Ignis instance.
   */

  _createClass(Ignis, [{
    key: 'init',
    value: function init() {
      // istanbul ignore next

      var _this = this;

      Ignis[_init].forEach(function (fn) {
        if (_this[_init].has(fn)) {
          return;
        }
        _this[_init].add(fn);
        fn.call(_this);
      });
    }

    /**
     * wait(1)
     *
     * @access         public
     * @description                Makes Ignis wait for the promise before starting.
     * @param          {action}    Function to call and wait for.
     * @returns        {Ignis}     Ignis instance for further chaining.
     */
  }, {
    key: 'wait',
    value: function wait(action) {
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
    }

    /**
     * listen(1)
     *
     * @description                Creates an Express.js application, mounts the
     *                             root router and listens for connections on the
     *                             specified port.
     * @param          {port}      [Optional] Port to listen on (default: PORT)
     * @returns        {promise}   Rejects when an error occurs.
     */
  }, {
    key: 'listen',
    value: function listen(port) {
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
    }

    /**
     * use(1)
     *
     * @access         public
     * @description                Make Ignis use the extension.
     * @param          {fn}        Function exported by the extension module.
     * @returns        {Ignis}     Ignis class for further chaining.
     */
  }, {
    key: 'use',
    value: function use(fn) {
      Ignis.use.call(this, fn);
    }
  }]);

  return Ignis;
})(_monologueJs2['default']);

exports['default'] = Ignis;
Ignis[_init] = [];

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
  Ignis[_init].push(fn);
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