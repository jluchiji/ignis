/**
 * util/expressify.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Bluebird    from 'bluebird';

/**
 * expressify(2)
 *
 * @description                Wraps a promise-producing function into an
 *                             express middleware that responds with the promise
 *                             results if resolved; invokes error handler stack
 *                             if rejected.
 * @param          {fn}        Promise-producing handler function.
 * @param          {status}    Status code to return on success (default: 200).
 */
export default function expressify(fn, status = 200) {

  /* Otherwise, unpromisify */
  return function(req, res, next) {
    return Bluebird
      .try(()    => { return fn(req); })
      .then(data => { res.status(status).send(data); next(); })
      .catch(next);
  };

}
