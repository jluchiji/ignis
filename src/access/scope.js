/**
 * access/scope.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

import Bluebird    from 'bluebird';
import Authorized  from 'authorized';

import Symbol      from '../util/symbols';
import Unpromisify from '../util/unpromisify';


/*!
 * Symbols used by scope.js
 */
export const __scopes = Symbol('Ignis::access::scopes');


/**
 * getScope(2)
 *
 * @description                Creates a function that retrieves the scope.
 * @param          {ignis}     The Ignis app instance.
 * @param          {name}      Name of the scope to retrieve.
 * @return         {Function}  Function that retrieves the scope.
 */
export function getScope(ignis, name) {
  return Unpromisify(function(req) {
    let callbacks = ignis[__scopes].get(name);

    /* Deny if there are no scope callbacks */
    if (!callbacks || callbacks.length === 0) {
      return Bluebird.resolve(null);
    }

    /* Start trying */
    return callbacks.reduce((last, next) => {

      return last.then(data => {
        if (data) { return data; }
        if (req.params[next.param]) {
          return next.callback(req.params[next.param]);
        }
        return null;
      });

    }, Bluebird.resolve(null)).then(data => data || null);
  });
}

/**
 * scope(3)
 *
 * @description                Specifies the callback to retrieve an entity.
 * @param          {name}      Name of the entity.
 * @param          {param}     URL param that contains ID used for the search.
 * @param          {callback}  Promise-generating callback to retrieve the
 *                             entity using the specified ID.
 * @return         {this}      Namespace for further chaining.
 */
export default function scope(name, param, callback) {
  let store = this[__scopes];

  /* Create a scope if it is not already present */
  if (!store.has(name)) {
    store.set(name, [ ]);
    Authorized.entity(name, (req, done) => {
      getScope(this, name)(req, done);
    });
  }

  store.get(name).push({ param: param, callback: callback });
}
