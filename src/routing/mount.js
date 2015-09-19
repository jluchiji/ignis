/**
 * routing/mount.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */


import _           from 'lodash';
import Path        from 'path';
import Debug       from 'debug';

import { expressify } from 'ignis-util';

const  debug = Debug('ignis:mount');

/**
 * mount(2)
 *
 * @param          {path}      Root path of the handler to mount.
 * @param          {meta}      Ignis.js request handler with metadata.
 * @return         {this}      Namespace for further chaining.
 */
export function mount(path, meta) {
  if (meta.__esModule) { meta = meta.default; }

  const handler = meta.handler;

  /* Split out the HTTP verb and URL. */
  let [ verb, url ] = meta.path.split(' ', 2); // eslint-disable-line prefer-const
  if (!verb || !url) { throw new Error(`Invalid mount path: ${meta.path}`); }

  /* Determine where to mount the endpoint */
  url = _.trimRight(Path.join(path, url), '/');
  debug(`Ignis::mount(): ${verb.toUpperCase()} ${url}`);

  /* Generate the middleware stack */
  const middleware = _.chain(this.factories)
    .map(factory => factory(this, meta))
    .compact()
    .value();

  /* Push the handler into the middleware stack */
  if (typeof handler !== 'function') {
    throw new Error(
      `Expected handler to be a function but got ${typeof handler}`);
  }
  middleware.push(expressify(handler));

  /* Mount the middleware stack to the root router */
  const router = this.root;
  const method = router[verb.toLowerCase()];

  if (!method) { throw new Error(`HTTP verb not supported: ${verb}`); }
  method.call(router, url, ...middleware);

  return this;
}
