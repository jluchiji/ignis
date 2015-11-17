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
module.exports = function Ignis() {
  return instance;
};


/* Reset instance */
module.exports.reset = function() {
  instance = new Core();
};


/* Register core services */
instance.use(Http);
instance.use(Config);

/* Attach error and panic shortcuts */
module.exports.Error = IgnisError;
Core.prototype.panic = IgnisError.panic;
Core.prototype.deny = IgnisError.deny;
Core.prototype.notFound = IgnisError.notFound;

/* Expose builtin services */
module.exports.Core = Core;
module.exports.Http = Http;
module.exports.Config = Config;
module.exports.Service = Service;
module.exports.DataSource = DataSource;
