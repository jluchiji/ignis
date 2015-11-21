/**
 * index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Core        from './core';


/* Singleton instance */
let instance = new Core();


/* Singleton function */
exports = Core.exports = module.exports = function Ignis() {
  return instance;
};


/* Reset instance */
exports.reset = function() {
  instance = new Core();
};


import Http        from './services/http';
import Config      from './services/config';
import Endpoint    from './services/endpoint';
import Service     from './service';
import IgnisError  from './error';


/* Register core services */
instance.use(Config);
instance.import(Endpoint);


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
exports.Http.Endpoint = Endpoint;


/* Export some core decorators */
exports.deps = Service.deps;
exports.export = Service.export;
exports.mount = Endpoint.path;
