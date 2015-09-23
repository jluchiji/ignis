/**
 * routing/mount.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */


import _           from 'lodash';
import Path        from 'path';
import Chalk       from 'chalk';
import Debug       from 'debug';

import { expressify } from 'ignis-util';

const  debug = Debug('ignis:mount');

const  styles = {
  get:    Chalk.bold.blue('GET   '),
  put:    Chalk.bold.yellow('PUT   '),
  post:   Chalk.bold.green('POST  '),
  delete: Chalk.bold.red('DELETE')
};

/**
 * mount(2)
 *
 * @param          {path}      Root path of the handler to mount.
 * @param          {meta}      Ignis.js request handler with metadata.
 * @return         {this}      Namespace for further chaining.
 */
export function mount(path, meta) {
  if (meta.__esModule) { meta = meta.default; }

  const status  = meta.status || 200;
  const handler = meta.handler;

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
  middleware.push(expressify(handler, status));

  /* Mount the middleware stack to the root router */
  const router = this.root;

  /* Split out the HTTP verb and URL. */
  if (!meta.path || meta.path.length === 0) {
    throw new Error('Mount path is missing or empty.');
  }
  meta.path = _.flatten([meta.path]);
  meta.path.forEach(uri => {


    let [ verb, url ] = uri.split(' ', 2); // eslint-disable-line prefer-const
    if (!verb || !url) { throw new Error(`Invalid mount path: ${uri}`); }

    /* Determine where to mount the endpoint */
    url = _.trimRight(Path.join(path, url), '/');
    verb = verb.toLowerCase();

    debug(`${styles[verb] || verb.toUpperCase()} ${url}`);

    const method = router[verb];
    if (!method) {
      throw new Error(`HTTP verb not supported: ${verb.toUpperCase()}`);
    }
    method.call(router, url, ...middleware);

  });

  return this;
}
