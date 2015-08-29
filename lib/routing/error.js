/**
 * routing/error.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.error = error;
exports.handler = handler;

var _ignisUtil = require('ignis-util');

/**
 * error(2)
 *
 * @description                Adds an error handler to the error handler stack.
 * @param          {type}      Type of the error to handle.
 * @param          {callback}  Callback function to handle the error.
 */

function error(type, callback) {
  this.wait(function (router) {
    router.use(handler(type, callback));
  });
  return this;
}

/**
 * handler(2)
 *
 * @description                Creates an express error handler that only
 *                             handles error specified by {type}.
 * @param          {type}      Type of the error to handle.
 * @return         {Function}  Express.js error handler callback.
 */

function handler(type, callback) {
  return function (err, req, res, next) {
    if ((0, _ignisUtil.errorIs)(err, type)) {
      callback(err, req, res, next);
    } else {
      next(err);
    }
  };
}
//# sourceMappingURL=../routing/error.js.map