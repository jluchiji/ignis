/**
 * index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Core        from './core';
import Http        from './services/http';
import Config      from './services/config';
import Service     from './service';
import DataSource  from './data-source';
import IgnisError  from './error';


/* Singleton instance */
let instance = new Core();


/* Singleton function */
exports = module.exports = function Ignis() {
  return instance;
};


/* Reset instance */
exports.reset = function() {
  instance = new Core();
};


/* Register core services */
instance.use(Http);
instance.use(Config);

/* Attach utilities */
exports.Util = { };
exports.Util.deepForEach = require('./util/deep-for-each');
exports.Util.errorIs = require('./util/error-is');
exports.Util.expressify = require('./util/expressify');
exports.Util.serviceName = require('./util/service-name');
exports.Util.unpromisify = require('./util/unpromisify');

/* Attach error and panic shortcuts */
exports.Error = IgnisError;
Core.prototype.panic = IgnisError.panic;
Core.prototype.deny = IgnisError.deny;
Core.prototype.notFound = IgnisError.notFound;

/* Expose builtin services */
exports.Core = Core;
exports.Http = Http;
exports.Config = Config;
exports.Service = Service;
exports.DataSource = DataSource;
