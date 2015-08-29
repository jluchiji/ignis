/**
 * routing/index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import { mount }   from './mount';
import { error }   from './error';
import Symbol      from '../util/symbols';


/*!
 * Export symbols used by the mount(2).
 */
export const mounted = Symbol('Ignis::routing::mounted');


/**
 * endpoint(2)
 *
 * @description                Mounts an endpoint extension to the path.
 * @param          {path}      Path of the endpoint, relative to app root.
 * @param          {fn}        Extension function that mounts middleware.
 * @return         {this}      Namespace for further chaining.
 */
export function endpoint(path, fn) {
  this.wait(function() {
    if (!this[mounted].has(fn)) {
      fn(path, this);
      this[mounted].add(fn);
    }
  });

  return this;
}


/*!
 * Initializer.
 */
export function init() {
  this[mounted] = new Set();
}


/*!
 * Ignis extension.
 */
export default function routingExtension(Ignis) {
  Ignis.init(init);
  Ignis.prototype.mount    = mount;
  Ignis.prototype.error    = error;
  Ignis.prototype.endpoint = endpoint;
}
