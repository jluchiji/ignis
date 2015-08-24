/**
 * routing/mount.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import Path        from 'path';

import Expressify  from '../util/expressify';

/**
 * mount(2)
 *
 * @param          {path}      Root path of the handler to mount.
 * @param          {handler}   Ignis.js request handler with metadata.
 * @return         {this}      Namespace for further chaining.
 */
export function mount(path, handler) {
  let meta = handler.meta || handler;

  /* Split out the HTTP verb and URL. */
  let [ verb, url ] = meta.path.split(' ', 2);
  if (!verb || !url) { throw new Error(`Invalid mount path: ${meta.path}`); }

  /* Determine where to mount the endpoint */
  url = _.trimRight(Path.join(path, url), '/');

  /* Generate the middleware stack */
  let middleware = _.chain(this.factories)
    .map(factory => factory(this, meta))
    .compact()
    .value();

  /* Push the handler into the middleware stack */
  middleware.push(Expressify(handler));

  /* Mount the middleware stack to the root router */
  let router = this.root;
  let method = router[verb.toLowerCase()];

  if (!method) { throw new Error(`HTTP verb not supported: ${verb}`); }
  method(url, ...middleware);

  return this;
}