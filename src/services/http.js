/**
 * http/index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import _           from 'lodash';
import Path        from 'path';
import Debug       from 'debug';
import Chalk       from 'chalk';
import Express     from 'express';
import {
  expressify,
  errorIs
}                  from 'ignis-util';

import Service     from '../service';

const debug = Debug('ignis:http');


/* Constants for pretty-printing debug messages */
const  styles = {
  get:    Chalk.bold.blue('GET '),
  put:    Chalk.bold.yellow('PUT '),
  post:   Chalk.bold.green('POST'),
  delete: Chalk.bold.red('DEL ')
};


/* Symbols for hiding internal details */
const $$pre = Symbol();
const $$post = Symbol();


/**
 * HTTP routing and endpoint management service.
 * Does not have an initialization callback.
 */
export default class HttpService extends Service {

  constructor(ignis) {
    super(ignis);

    this[$$pre] = [ ];
    this[$$post] = [ ];
    this.router = Express();

    /* Do not leak server info! */
    this.router.disable('x-powered-by');
  }


  /**
   * Registers a pre-callback middleware factory.
   */
  pre(factory) {
    this[$$pre].push(factory);
  }


  /**
   * Registers a post-callback middleware factory.
   */
  post(factory) {
    this[$$post].push(factory);
  }


  /**
   * Mounts an HTTP endpoint to the application root.
   */
  mount(path, meta) {

    /* Unwrap ES6 modules */
    if (meta.__esModule) { meta = meta.default; }

    /* Essential parameters */
    const status  = meta.status || 200;
    let handler = meta;
    if (typeof meta.handler === 'function') { handler = meta.handler; }

    /* Sanity check for parameters */
    if (typeof handler !== 'function') {
      throw new Error(`Expected handler to be a function but got ${typeof handler}`);
    }
    if (!meta.path || meta.path.length === 0) {
      throw new Error('Mount path is missing or empty.');
    }

    /* Generate the middleware stack */
    const pre = _.chain(this[$$pre])
      .map(factory => factory(this, meta))
      .compact()
      .value();
    const post = _.chain(this[$$post])
      .map(factory => factory(this, meta))
      .compact()
      .value();

    /* Mount the stack to the Express application */
    const callback = expressify(handler, this, status);
    const middleware = Array.prototype.concat(pre, callback, post);

    meta.path = _.flatten([meta.path]);
    meta.path.forEach(uri => {

      let [ verb, url ] = uri.split(' ', 2); // eslint-disable-line prefer-const
      if (!verb || !url) { throw new Error(`Invalid mount path: ${uri}`); }

      /* Determine where to mount the endpoint */
      url = _.trimRight(Path.join(path, url), '/');
      verb = verb.toLowerCase();

      debug(`${styles[verb] || verb.toUpperCase()} ${url}`);

      const method = this.router[verb];
      if (!method) {
        throw new Error(`HTTP verb not supported: ${verb.toUpperCase()}`);
      }
      method.call(this.router, url, ...middleware);
    });

  }


  /**
   * Mounts an error handler to the application root.
   */
  error(guard, callback) {
    const handler = function(err, req, res, next) {
      if (errorIs(err, guard)) {
        callback(err, req, res, next);
      } else {
        next(err);
      }
    };

    this.router.use(handler);
  }

}


/**
 * Expose symbols
 */
HttpService.$$pre = $$pre;
HttpService.$$post = $$post;
