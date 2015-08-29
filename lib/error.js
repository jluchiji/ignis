/**
 * error.js
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

exports['default'] = ignisError;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

// istanbul ignore next

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

/**
 * IgnisError
 *
 * @description    Error arising within Ignis.js that should be reported back
 *                 to the client via an HTTP response.
 */

var IgnisError = (function (_Error) {
  _inherits(IgnisError, _Error);

  function IgnisError(status, message, details) {
    _classCallCheck(this, IgnisError);

    _get(Object.getPrototypeOf(IgnisError.prototype), 'constructor', this).call(this, message);

    this.name = 'IgnisError';
    this.status = status;
    this.message = message;
    this.details = details;

    if (details && details.sensitive) {
      this.sensitive = true;
    }
  }

  /*!
   * Extension
   */

  /**
   * .panic(3)
   *
   * @static
   * @access                   public
   * @description              Throws an IgnisError.
   * @param        {status}    Status code to report to the client.
   * @param        {message}   Human-readable message to report.
   * @param        {details}   Additional error details and options.
   * @throws       {IgnisError}
   */

  _createClass(IgnisError, null, [{
    key: 'panic',
    value: function panic(status, message, details) {
      throw new IgnisError(status, message, details);
    }

    /**
     * .deny(2)
     *
     * @static
     * @access                   public
     * @description              Throws an IgnisError with status of 403.
     * @param        {message}   Human-readable message to report.
     * @param        {details}   Additional error details.
     * @throws       {IgnisError}
     */
  }, {
    key: 'deny',
    value: function deny(message, details) {
      details = _lodash2['default'].assign(details || {}, { sensitive: true });
      throw new IgnisError(403, message, details);
    }

    /**
     * .notFound(2)
     *
     * @static
     * @access                   public
     * @description              Throws an IgnisError with status of 404.
     * @param        {message}   Human-readable message to report.
     * @param        {details}   Additional error details.
     * @throws       {IgnisError}
     */
  }, {
    key: 'notFound',
    value: function notFound(message, details) {
      throw new IgnisError(404, message, details);
    }
  }]);

  return IgnisError;
})(Error);

exports.IgnisError = IgnisError;

function ignisError(Ignis) {
  Ignis.prototype.deny = IgnisError.deny;
  Ignis.prototype.panic = IgnisError.panic;
  Ignis.prototype.notFound = IgnisError.notFound;
  Ignis.prototype.Error = IgnisError;
  Ignis.Error = IgnisError;
}
//# sourceMappingURL=error.js.map