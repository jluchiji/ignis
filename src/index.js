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
module.exports = function Ignis() {
  return instance;
};


/* Reset instance */
module.exports.reset = function() {
  instance = new Core();
};


/* Register core services */
instance.use(require('./services/http'));
