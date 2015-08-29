/**
 * routing/index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import { mount }   from './mount';
import { error }   from './error';

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
    if (!this.__mounted.has(fn)) {
      fn(path, this);
      this.__mounted.add(fn);
    }
  });

  return this;
}


/*!
 * Initializer.
 */
export function init() {
  Object.defineProperty(this, '__mounted', { value: new Set() });
}


/*!
 * Ignis extension.
 */
export default function routingExtension(ignis) {
  Object.defineProperty(ignis, '__mounted', { value: new Set() });
  ignis.mount    = mount;
  ignis.error    = error;
  ignis.endpoint = endpoint;
}
