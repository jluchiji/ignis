/**
 * routing/index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import { mount }   from './mount';


/*!
 * Set to trach already-mounted endpoints.
 */
const mounted = new Set();


/**
 * endpoint(2)
 *
 * @description                Mounts an endpoint extension to the path.
 * @param          {path}      Path of the endpoint, relative to app root.
 * @param          {fn}        Extension function that mounts middleware.
 * @return         {this}      Namespace for further chaining.
 */
export function endpoint(path, fn) {
  if (!mounted.has(fn)) {
    fn(path, this);
    mounted.add(fn);
  }
  return this;
}


/*!
 * Ignis extension.
 */
export default function routingExtension(ignis) {
  ignis.mount    = mount;
  ignis.endpoint = endpoint;
}
